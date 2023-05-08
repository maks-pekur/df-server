import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(phoneNumber: string) {
    const user = await this.usersService.findOne(phoneNumber);

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }
    if (user) {
      return {
        userId: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
      };
    } else {
      return null;
    }
  }
}
