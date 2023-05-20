import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async get(phoneNumber: string) {
    const user = await this.usersService.findUser(phoneNumber);
    return user;
  }
}
