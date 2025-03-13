import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
export class UpdateRoleInAccountUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  role: Role;
}
