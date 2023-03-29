import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CreateAccountUserDto } from '../modules/account-users/create-accountUser.dto';

@Injectable()
export class TransformPipe implements PipeTransform<any> {
  transform(value: any): CreateAccountUserDto {
    const { username, email, password } = value;
    if (!email || !password) {
      throw new BadRequestException('Invalid request payload');
    }
    return { email, password };
  }
}
