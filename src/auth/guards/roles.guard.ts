import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role === 'superadmin') {
      return true;
    }

    const userCompanyRole = user.userCompanies.find(
      (userCompany) => userCompany.role.name === roles,
    );

    if (!userCompanyRole) {
      return false;
    }

    const userCompany = user.userCompanies.find(
      (userCompany) => userCompany.id === request.params.companyId,
    );

    return Boolean(userCompany);
  }
}
