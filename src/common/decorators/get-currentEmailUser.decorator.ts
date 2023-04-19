import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Payload } from '../bases/types/payload.type';

export const GetCurrentEmailUser = createParamDecorator (
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    console.log('(GetCurrentEmailUser) check request: ', request.user['email'])
    //const user = request.user as Payload;
    const email = request.user['payload'].email;
    return  email;
  },
);