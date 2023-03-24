import { Body, Controller, Get, HttpCode, Post, Req, UseGuards, UsePipes } from "@nestjs/common";
import { Observable } from "rxjs";
import { AccountUserService } from "./accountUser.service";
import { AccountUserDto } from "./accountUser.dto";
import { LoginUserDto } from "./login-accountUser.dto";
import { CreateAccountUserDto } from "./create-accountUser.dto";
import { ValidatorPipe } from "src/pipes/validator.pipe";
import { AuthService } from "../authentication/auth.service";

@Controller('users')
export class AccountUserController{
    constructor(private accountUserService: AccountUserService,
        private authService: AuthService) {}
    // Rest Call: POST http://localhost:8080/api/users/

    @Post()
    @UsePipes(new ValidatorPipe())
    // đăng kí
    create(@Body() createdUserDto: CreateAccountUserDto) {  
        return this.accountUserService.createAccountUser(createdUserDto);
    }
}



// Rest Call: POST http://localhost:3000/api/users/login
    // @Post('login')
    // @HttpCode(200)
    // login(@Body() loginUserDto: LoginUserDto): Observable<Object> {
    //     return this.accountUserService.login(loginUserDto);
    // }

    // @Post('login')
    // @HttpCode(200)
    // login(@Body() loginUserDto: LoginUserDto) {
    //     return this.authService.login(loginUserDto);
    // }

    // Rest Call: GET http://localhost:8080/api/users/ 
    // Requires Valid JWT from Login Request
    //@UseGuards(JwtAuthGuard)
    // @Get()
    // findAll(@Req() request): Observable<[]> {
    //     //return this.accountUserService.getAccountUsers
    // }