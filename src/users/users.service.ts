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
  login(req) {
    return { user: req.user, msg: 'Logged in' };
  }
  logout() {
    return '';
  }

  findOne(phoneNumber: string) {
    return this.userModel.findOne({ where: { phoneNumber } });
  }
}
