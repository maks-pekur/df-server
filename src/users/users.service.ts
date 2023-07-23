import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.usersRepository.findOne({ where: { phoneNumber } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);
    return newUser;
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
    const existUser = await this.usersRepository.findOne({
      where: { id },
    });

    if (existUser && existUser.id !== id) {
      throw new BadRequestException('Category already exists');
    }

    await this.usersRepository.update(id, updateUserDto);

    return this.findOne(id);
  }
}
