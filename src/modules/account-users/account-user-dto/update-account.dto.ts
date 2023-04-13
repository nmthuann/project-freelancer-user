import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class UpdateAccountUserDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string

    refresh_token: string;
}