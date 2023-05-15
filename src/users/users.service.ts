import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async addUser(createUserDTO: CreateUserDto): Promise<User> {
    const newUser = await this.userModel.create(createUserDTO);
    return newUser.save();
  }

  async findUser(phoneNumber: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ phoneNumber });
    return user;
  }
}
