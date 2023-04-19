import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/bases/enums/role.enum';
import { InformationUserDto } from 'src/modules/infor-users/infor-user-dto/inforUser.dto';

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