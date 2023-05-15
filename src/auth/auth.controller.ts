import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/register')
  async register(@Body() createUserDTO: CreateUserDto) {
    const user = await this.userService.addUser(createUserDTO);
    return user;
  }

  // @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('/user')
  getProfile(@Request() req) {
    return req.user;
  }
}
