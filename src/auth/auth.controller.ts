import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  validate(@Body() phoneNumber: string) {
    return this.authService.validateUser(phoneNumber);
  }
}
