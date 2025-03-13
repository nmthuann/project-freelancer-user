import { InformationUserDto } from 'src/modules/infor-users/dtos/infor-user.dto';
export class UpdateAccountUserDto {
  readonly email: string;
  readonly password: string;
  readonly refresh_token: string;
  readonly infor: InformationUserDto;

  constructor(
    email: string,
    password: string,
    refresh_token: string,
    infor: InformationUserDto,
  ) {
    this.email = email;
    this.password = password;
    this.refresh_token = refresh_token;
    this.infor = infor;
  }
}
