import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Payload } from '../types/payload.type';

export const GetCurrentEmailUser = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as Payload;
    return user.email;
  },
);