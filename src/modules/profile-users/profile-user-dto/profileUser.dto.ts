import { InformationUserEntity } from "src/modules/infor-users/inforUser.entity";

export class UpdateProfileUserDto {
    infor: InformationUserEntity
    avatar: string;
    occupation: string;
    my_skill: string;
    level: string;
}

