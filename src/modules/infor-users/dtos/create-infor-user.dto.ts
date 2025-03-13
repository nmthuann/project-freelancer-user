import { AccountUserDto } from 'src/modules/account-users/dtos/account-user.dto';

export class CreateInformationUserDto {
  account: AccountUserDto;

  first_name: string;
  last_name: string;
  gender: string;
  birthday: Date;
  address: string;
  phone: string;
  education: string;
  //profile: number;
}
