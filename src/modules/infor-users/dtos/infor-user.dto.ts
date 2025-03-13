import { AccountUserDto } from 'src/modules/account-users/dtos/account-user.dto';
import { ProfileUserDto } from 'src/modules/profile-users/dtos/profile-user.dto';

export class InformationUserDto {
  account: AccountUserDto;
  profile: ProfileUserDto;

  infor_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  birthday: Date;
  address: string;
  phone: string;
  education: string;
}
