import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(phoneNumber: string): Promise<any> {
    const user = await this.userService.findUser(phoneNumber);

    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      phoneNumber: user.phoneNumber,
      sub: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
