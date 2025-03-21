import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { InformationUserDto } from 'src/modules/infor-users/dtos/infor-user.dto';

export class AccountUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  status: string;

  refresh_token: string;

  role: Role;

  infor: InformationUserDto;
}
