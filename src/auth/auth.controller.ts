import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { CurrentUser, Public } from 'src/common/decorators';
import { JwtPayload } from 'src/jwt/interfaces';
import { JwtService } from 'src/jwt/jwt.service';
import { SmsService } from 'src/sms/sms.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('/sign-in')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res() res: Response) {
    const isProduction = this.configService.get('IS_PRODUCTION') === 'true';

    const agent = req.headers['user-agent'];

    const { accessToken, refreshToken, user } = await this.authService.login(
      req.user,
      agent,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
    });

    return res.send(user);
  }

  @Public()
  @Post('/check-companies')
  async checkCompanies(@Body('email') email: string) {
    return await this.authService.checkCompanies(email);
  }

  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    if (!req.cookies.refreshToken) {
      console.log('No refresh token found in the request');
      throw new BadRequestException('Refresh token not found');
    }

    const newAccessToken = await this.jwtService.updateAccessToken(
      req.cookies.refreshToken.token,
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    return res.sendStatus(204);
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    if (!req.cookies.refreshToken) {
      throw new BadRequestException('Refresh token not found');
    }

    await this.jwtService.revokeRefreshToken(req.cookies.refreshToken);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
  }

  @Get('/me')
  async getMe(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @Public()
  @Post('/sign-in/phone')
  signInWithPhoneNumber(@Body('phoneNumber') phoneNumber: string) {
    return this.smsService.sendOtp(phoneNumber);
  }

  @Public()
  @Post('/sign-in/phone/verify')
  verifyOtp(
    @Body('phoneNumber') phoneNumber: string,
    @Body('code') code: string,
  ) {
    return this.smsService.verifyOtp(phoneNumber, code);
  }
}
