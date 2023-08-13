import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { isPublic } from 'src/common/decorators';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (isPublic(context, this.reflector)) {
      return true;
    }

    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      throw new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest();

    const user = await this.userService.findOne(request.user.userId);

    const userCompany = user.userCompanies.find(
      (userCompany) => userCompany.company.id === request.user.companyId,
    );

    if (!userCompany) {
      this.logger.warn(
        `User with ID: ${request.user.userId} does not have a relation with company ID: ${request.user.companyId}`,
      );
      throw new UnauthorizedException(
        'User does not have access to this company',
      );
    }

    if (userCompany.role.name !== request.user.role) {
      this.logger.warn(
        `Role mismatch for user ID: ${request.user.userId} and company ID: ${request.user.companyId}. Expected: ${userCompany.role.name}, got: ${request.user.role}`,
      );
      throw new UnauthorizedException(
        'User does not have access to this company',
      );
    }

    request.user = {
      userId: request.user.userId,
      companyId: userCompany.company.id,
      role: userCompany.role.name,
    };

    return true;
  }
}
