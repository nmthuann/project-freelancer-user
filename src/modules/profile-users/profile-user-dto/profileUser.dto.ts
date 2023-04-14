import { InformationUserDto } from "src/modules/infor-users/infor-user-dto/inforUser.dto";

export class ProfileUserDto {
    profile_id: number;
    
    avatar: string;
    occupation: string;
    my_skill: string;
    level: string;

    infor: InformationUserDto;
}

