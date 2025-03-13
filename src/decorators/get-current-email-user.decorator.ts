import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentEmailUser = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    console.log('(GetCurrentEmailUser) check request: ', request.user['email']);
    const email = request.user['payload'].email;
    return email;
  },
);
