import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Company } from 'src/companies/entities/company.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCompany } from './entities/user-company.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(UserCompany)
    private userCompaniesRepository: Repository<UserCompany>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existUser) {
      throw new BadRequestException('Email already exists');
    }

    const userRole = await this.rolesRepository.findOne({
      where: { id: createUserDto.roleId },
    });
    if (!userRole) {
      throw new NotFoundException(
        `Role with ID "${createUserDto.roleId}" not found`,
      );
    }

    const company = await this.companiesRepository.findOne({
      where: { id: createUserDto.companyId },
    });
    if (!company) {
      throw new NotFoundException(
        `Company with ID "${createUserDto.companyId}" not found`,
      );
    }

    const salt = await bcrypt.genSalt(10);

    const user = await this.usersRepository.save({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, salt),
    });

    await this.userCompaniesRepository.save({
      user,
      company,
      role: userRole,
    });

    return user;
  }

  async findAll() {
    const users = await this.usersRepository.find({
      select: [
        'id',
        'name',
        'email',
        'phoneNumber',
        'isVerified',
        'createdAt',
        'updatedAt',
      ],
    });

    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'email',
        'phoneNumber',
        'isVerified',
        'userCompanies',
        'createdAt',
        'updatedAt',
      ],
      relations: ['userCompanies', 'userCompanies.role'],
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
    const existUser = await this.usersRepository.findOne({
      where: { id },
    });

    if (!existUser) {
      throw new BadRequestException('User not found');
    }

    const userCompanies = await this.userCompaniesRepository.find({
      where: { user: existUser },
    });

    await this.userCompaniesRepository.remove(userCompanies);

    await this.usersRepository.delete(id);

    return { message: 'User deleted successfully' };
  }
}
