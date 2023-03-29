import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshPayload } from '../types/refresh.type';

export const GetCurrentUser = createParamDecorator(
  (data: keyof RefreshPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);