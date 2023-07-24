import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/types';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existUser) {
      throw new BadRequestException('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);

    const user = await this.usersRepository.save({
      ...createUserDto,
      role: createUserDto.role || UserRole.CUSTOMER,
      password: await bcrypt.hash(createUserDto.password, salt),
    });

    return user;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Category not found');
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

    await this.usersRepository.delete(id);

    return { message: 'User deleted successfully' };
  }
}
