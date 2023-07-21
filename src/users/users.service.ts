import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async update(user: User): Promise<User> {
    await this.usersRepository.save(user);
    return user;
  }
}
