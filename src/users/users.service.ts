import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupUserDto } from './dto/signup-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  signup(signupUserDto: SignupUserDto) {
    const newUser = new this.userModel(signupUserDto);
    return newUser.save();
  }

  login(phoneNumber) {
    try {
      const userExist = this.userModel.findOne({ phoneNumber });

      if (!userExist) {
        throw new Error('User not found');
      }

      return {
        success: true,
        message: 'Login successful',
      };
    } catch (error) {
      throw error;
    }
  }

  check(req) {
    return req.user;
  }

  logout(req) {
    req.session.destroy();
    return { msg: 'session has ended' };
  }

  findOneByPhoneNumber(phoneNumber: string) {
    return this.userModel.findOne({ phoneNumber });
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }
}
