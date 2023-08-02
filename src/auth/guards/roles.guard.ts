import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const companyId = request.headers['company_id'];

    console.log('companyId:', companyId);
    console.log('User:', user);

    for (const userCompany of user.userCompanies) {
      console.log('User Company ID:', userCompany.company.id);
      console.log('User Company Role:', userCompany.role.name);
      if (
        userCompany.company.id === companyId &&
        roles.includes(userCompany.role.name)
      ) {
        return true;
      }
    }

    return false;
  }
}
