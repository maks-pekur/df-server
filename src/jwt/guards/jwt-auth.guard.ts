import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);

    if (!canActivate) {
      throw new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.['accessToken'];

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      console.log('Verification error:', error);
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.usersService.findOne(payload.userId);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const companyIds = payload.userCompanies.map(
      (userCompany) => userCompany.companyId,
    );

    if (!companyIds.includes(request.headers['company_id'])) {
      throw new UnauthorizedException(
        'User does not have access to this company',
      );
    }

    request.user = user;
    return true;
  }
}
