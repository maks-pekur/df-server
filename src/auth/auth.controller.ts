import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TokenService } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async login(@Request() req, @Res() response: Response) {
    const user = await this.authService.login(req.user);
    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user);

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    response.cookie('refreshToken', refreshToken.token, {
      httpOnly: true,
      sameSite: 'strict',
    });

    return response.send(user);
  }

  @Post('/refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Res() response: Response,
  ) {
    const newAccessToken = await this.tokenService.updateAccessToken(
      refreshToken,
    );

    response.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    return response.sendStatus(200);
  }
}
