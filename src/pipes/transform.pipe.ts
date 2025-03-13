import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CreateAccountUserDto } from 'src/modules/account-users/dtos/create-account-user.dto';

@Injectable()
export class TransformPipe implements PipeTransform<any> {
  transform(value: any): CreateAccountUserDto {
    const { email, password } = value;
    if (!email || !password) {
      throw new BadRequestException('Invalid request payload');
    }
    return { email, password };
  }
}
