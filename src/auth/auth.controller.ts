import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
}
