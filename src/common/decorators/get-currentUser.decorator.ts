import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshPayload } from '../types/refresh.type';

export const GetCurrentUser = createParamDecorator(
  (data: string| undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    console.log("(GetCurrentUser) Check request.user: ", request.user);
    return request.user[data];
  },
);