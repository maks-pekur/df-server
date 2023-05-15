import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { SignupUserDto } from './dto/signup-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @Header('content-type', 'application/json')
  async signup(@Body() signupUserDto: SignupUserDto) {
    return this.usersService.signup(signupUserDto);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUser: { phoneNumber: string }) {
    return this.usersService.login(loginUser.phoneNumber);
  }

  @Get('/check-auth')
  @UseGuards(AuthenticatedGuard)
  async checkAuth(@Request() req) {
    return this.usersService.check(req);
  }

  @Get('/logout')
  @UseGuards(AuthenticatedGuard)
  async logout(@Request() req) {
    return this.usersService.logout(req);
  }

  @Get()
  async findOne(@Body() phoneNumber: string) {
    return this.usersService.findOne(phoneNumber);
  }
}
