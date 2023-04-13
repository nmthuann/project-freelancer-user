import { AccountUserEntity } from "src/modules/account-users/accountUser.entity";

export class InformationUserDto{
    account: AccountUserEntity;
    first_name: string;
    last_name: string;
    gender: string;
    birthday: Date;
    address: string;
    phone: string;
    education: string;
}