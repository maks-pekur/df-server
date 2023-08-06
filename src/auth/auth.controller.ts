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
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtService } from 'src/jwt/jwt.service';
import { SmsService } from 'src/sms/sms.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private smsService: SmsService,
  ) {}

  @Post('/sign-in')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res() res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      req.user,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    return res.send(user);
  }

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
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request, @Res() res: Response) {
    if (!req.cookies.accessToken) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    const user = await this.authService.getMe(req.user);
    return res.status(200).send(user);
  }

  @Post('/sign-in/phone')
  signInWithPhoneNumber(@Body('phoneNumber') phoneNumber: string) {
    return this.smsService.sendOtp(phoneNumber);
  }

  @Post('/sign-in/phone/verify')
  verifyOtp(
    @Body('phoneNumber') phoneNumber: string,
    @Body('code') code: string,
  ) {
    return this.smsService.verifyOtp(phoneNumber, code);
  }
}
