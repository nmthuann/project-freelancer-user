import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards, UsePipes } from "@nestjs/common";
import { Observable } from "rxjs";
import { AccountUserService } from "./accountUser.service";
import { CreateAccountUserDto } from "./account-user-dto/create-accountUser.dto";
import { ValidatorPipe } from "src/common/pipes/validator.pipe";
import { TransformPipe } from "src/common/pipes/transform.pipe";
import { AccountUserEntity } from "./accountUser.entity";

@Controller('account-user')
export class AccountUserController{
    constructor(private accountUserService: AccountUserService) {}

    // tạo tài khỏa
    @Post('create')
    @UsePipes(new ValidatorPipe(), new TransformPipe())
    async createAccountUser(@Body() createdUserDto: CreateAccountUserDto) : Promise<CreateAccountUserDto>{  
        return await this.accountUserService.createAccountUser(createdUserDto);
    }
    
    @Put('update/:email')
    async updateAccountUserSetRoleByEmail(@Param('email')
        email: string):Promise<boolean>{
        return await this.accountUserService.updateAccountUserSetRole(email);
    }

    @Put('setOff/:email') // set Active = false -> @Delete()
    async deleteAccountUserSetOff(@Param('email') email: string ){
         return await this.accountUserService.deleteAccountUserSetOff(email);
    }

    @Delete('delete/:email')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAccountUserByEmail(@Param('email') email: string){
        console.log(this.accountUserService.deleteAccountUserByEmail(email));
    }
    
    @Get('AccountUsers')
    async getAccountUsers(): Promise<AccountUserEntity[]> {
        return await this.accountUserService.getAccountUsers();
    }

    @Get('/:email')
    async getAccountUserByEmail(@Param('email') email: string){
        return await this.accountUserService.getAccountUserByEmail(email);
    }
}