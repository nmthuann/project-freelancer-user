import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Payload } from '../types/payload.type';

export const GetCurrentRoleUser = createParamDecorator (
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    console.log('(GetCurrentRoleUser) check request: ', request.user)
    console.log('(GetCurrentRoleUser) check request: ', request.user['payload'].role)
    //const user = request.user as Payload;
    const role = request.user['payload'].role;
    return role;
  },
);