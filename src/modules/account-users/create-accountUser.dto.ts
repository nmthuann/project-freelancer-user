import { IsString } from "class-validator";
import { LoginUserDto } from "./login-accountUser.dto";


export class AccountUserDto extends LoginUserDto {

    @IsString()
    name: string; 
    
}