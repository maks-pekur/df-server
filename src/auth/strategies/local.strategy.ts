import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    const { companyId } = req.body;
    const user = await this.authService.validateUser(
      email,
      password,
      companyId,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
