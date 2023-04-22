//import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { InformationUserDto } from "src/modules/infor-users/infor-user-dto/inforUser.dto";
export class UpdateAccountUserDto {

    //@IsEmail()
    readonly email: string;

    //@IsNotEmpty()
    readonly password: string

    readonly refresh_token: string;

    readonly infor: InformationUserDto

    constructor(
        email: string, 
        password: string, 
        refresh_token: string, 
        infor: InformationUserDto
    ){
        this.email = email;
        this.password = password;
        this.refresh_token = refresh_token;
        this.infor = infor;
    }
    
}