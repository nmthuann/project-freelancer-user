import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/bases/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate{
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log("requiredRoles: ",requiredRoles)
    if (!requiredRoles) return true;

    const {user} = context.switchToHttp().getRequest();
    console.log("Current Role: ", context)
    return requiredRoles.some((roles) => user.role?.includes(roles));
    //return true;
  }
} 