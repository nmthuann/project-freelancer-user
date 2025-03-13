import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAccountUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
