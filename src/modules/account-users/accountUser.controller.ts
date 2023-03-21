import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { Observable } from "rxjs";
import { AccountUserService } from "./accountUser.service";
import { AccountUserDto } from "./create-accountUser.dto";
import { LoginUserDto } from "./login-accountUser.dto";

@Controller('users')
export class AccountUserController{
    constructor(private accountUserService: AccountUserService) {}
    // Rest Call: POST http://localhost:8080/api/users/
    @Post()
    create(@Body() createdUserDto: AccountUserDto): Observable<AccountUserDto> {
        return this.accountUserService.createAccountUser(createdUserDto);
    }

    // Rest Call: POST http://localhost:8080/api/users/login
    @Post('login')
    @HttpCode(200)
    login(@Body() loginUserDto: LoginUserDto): Observable<Object> {
        return;
    }

    // Rest Call: GET http://localhost:8080/api/users/ 
    // Requires Valid JWT from Login Request
    //@UseGuards(JwtAuthGuard)
    // @Get()
    // findAll(@Req() request): Observable<[]> {
    //     //return this.accountUserService.getAccountUsers
    // }
}