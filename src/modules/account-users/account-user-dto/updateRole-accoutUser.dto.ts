import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/common/bases/types/role.type";
export class UpdateRoleInAccountUserDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string

    role: Role
}