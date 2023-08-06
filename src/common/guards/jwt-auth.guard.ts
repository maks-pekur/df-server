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
    private userService: UsersService,
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

    const user = await this.userService.findOne(payload.userId);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const userCompany = user.userCompanies.find(
      (userCompany) => userCompany.company.id === payload.companyId,
    );

    if (!userCompany || userCompany.role.name !== payload.role) {
      throw new UnauthorizedException(
        'User does not have access to this company',
      );
    }

    request.user = {
      userId: payload.userId,
      companyId: userCompany.company.id,
      role: userCompany.role.name,
    };

    return true;
  }
}
