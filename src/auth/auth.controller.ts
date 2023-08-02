import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from 'src/jwt/jwt.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/sign-in')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Res() response: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      req.user,
    );

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    return response.send(user);
  }

  @Post('/check-companies')
  async checkCompanies(@Body('email') email: string) {
    return await this.authService.checkCompanies(email);
  }

  @Post('/refresh')
  async refresh(@Body() refreshToken: string, @Res() response: Response) {
    const newAccessToken = await this.jwtService.updateAccessToken(
      refreshToken,
    );

    response.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    return response.sendStatus(200);
  }
}
