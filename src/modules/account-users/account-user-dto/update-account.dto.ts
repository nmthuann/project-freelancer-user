import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { InformationUserDto } from "src/modules/infor-users/infor-user-dto/inforUser.dto";
export class UpdateAccountUserDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string

    refresh_token: string;

    infor: InformationUserDto
}