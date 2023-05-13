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
  signup(@Body() signupUserDto: SignupUserDto) {
    return this.usersService.signup(signupUserDto);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    return this.usersService.login(req);
  }

  @Get('/check-auth')
  @UseGuards(AuthenticatedGuard)
  checkAuth(@Request() req) {
    return this.usersService.check(req);
  }

  @Get('/logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Request() req) {
    return this.usersService.logout(req);
  }

  @Get()
  findOne(@Body() phoneNumber: string) {
    return this.usersService.findOne(phoneNumber);
  }
}