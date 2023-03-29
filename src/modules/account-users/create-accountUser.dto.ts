import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { LoginUserDto } from "./login-accountUser.dto";


export class CreateAccountUserDto { //extends LoginUserDto 

    
    // @IsString()
    // email: string;

    // giá trị mặc định
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

}