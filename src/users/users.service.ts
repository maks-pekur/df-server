import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Company } from 'src/companies/entities/company.entity';
import { RefreshToken } from 'src/jwt/entities/refresh-token.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Role } from 'src/roles/entities/role.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCompany } from './entities/user-company.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(UserCompany)
    private userCompaniesRepository: Repository<UserCompany>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.entityManager.transaction(async (transactionalEM) => {
      const existUser = await transactionalEM.findOne(User, {
        where: { email: createUserDto.email },
      });
      if (existUser) {
        throw new BadRequestException('Email already exists');
      }

      const userRole = await transactionalEM.findOne(Role, {
        where: { id: createUserDto.roleId },
      });
      if (!userRole) {
        throw new NotFoundException(
          `Role with ID "${createUserDto.roleId}" not found`,
        );
      }

      const company = await transactionalEM.findOne(Company, {
        where: { id: createUserDto.companyId },
      });
      if (!company) {
        throw new NotFoundException(
          `Company with ID "${createUserDto.companyId}" not found`,
        );
      }

      const salt = await bcrypt.genSalt(10);

      const user = transactionalEM.create(User, {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, salt),
      });

      await transactionalEM.save(User, user);

      user.roles = [userRole];
      await transactionalEM.save(User, user);

      await transactionalEM.save(UserCompany, {
        user,
        company,
        role: userRole,
      });

      return user;
    });
  }

  async findAll() {
    try {
      const users = await this.usersRepository.find({
        select: [
          'id',
          'name',
          'email',
          'phoneNumber',
          'isPhoneVerified',
          'createdAt',
          'updatedAt',
        ],
      });
      return users;
    } catch (error) {
      throw new NotFoundException('Users not found');
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: [
        'userCompanies',
        'userCompanies.company',
        'userCompanies.role',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async delete(id: string) {
    try {
      return await this.entityManager.transaction(async (transactionalEM) => {
        const existUser = await transactionalEM.findOne(User, {
          where: { id },
        });

        if (!existUser) {
          throw new BadRequestException('User not found');
        }

        const userCompanies = await transactionalEM
          .createQueryBuilder(UserCompany, 'userCompany')
          .innerJoin('userCompany.user', 'user')
          .where('user.id = :userId', { userId: existUser.id })
          .getMany();

        await transactionalEM.remove(UserCompany, userCompanies);
        await transactionalEM.delete(RefreshToken, { user: existUser });
        await transactionalEM.delete(Order, { user: existUser });
        await transactionalEM.delete(Review, { user: existUser });

        await transactionalEM.delete(User, id);

        return { message: 'User deleted successfully' };
      });
    } catch (error) {
      this.logger.error(`Failed to delete user with ID ${id}.`, error.stack);
      throw new InternalServerErrorException('Failed to delete user.');
    }
  }
}
