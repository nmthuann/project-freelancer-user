import { AccountUserDto } from "src/modules/account-users/account-user-dto/accountUser.dto";
import { AccountUserEntity } from "src/modules/account-users/accountUser.entity";
import { ProfileUserDto } from "src/modules/profile-users/profile-user-dto/profileUser.dto";

export class InformationUserDto{
    account: AccountUserDto;
    profile: ProfileUserDto;

    infor_id: number
    first_name: string;
    last_name: string;
    gender: string;
    birthday: Date;
    address: string;
    phone: string;
    education: string;
}