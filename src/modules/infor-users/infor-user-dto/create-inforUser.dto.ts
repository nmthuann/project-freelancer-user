import { AccountUserDto } from "src/modules/account-users/account-user-dto/accountUser.dto";
import { AccountUserEntity } from "src/modules/account-users/accountUser.entity";

export class CreateInformationUserDto{
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