import { Body, Controller, HttpException, HttpStatus, Post, UseGuards, Request, Get, Param } from '@nestjs/common';
import { AccountUserService } from '../account-users/accountUser.service';
import { AuthService } from './auth.service';
import { AccountUserDto } from '../account-users/accountUser.dto';
import { CreateAccountUserDto } from '../account-users/create-accountUser.dto';
import { LocalAuthGuard } from 'src/guards/auth.guard';
import { AuthenticationGuard } from 'src/guards/local.guard';

@Controller()
export class AuthController {
  constructor(
    private accountUserService: AccountUserService,
    private authService: AuthService,
  ) {}

 //fucntion register user
  @Post('/register')
  async registerUser(@Body() input: CreateAccountUserDto) {
    const check = await this.validate(input.email);
    if (!check) {
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    }

    input.password = await this.authService.hashPassword(input.password);
    return this.accountUserService.create(input);
  }
  
  //handle login
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() request): Promise<any> {
    return this.authService.login(request.user);
  }
  
//   @UseGuards(AuthenticationGuard)
//   @Get('users/:id')
//     async getUserById(@Param() params): Promise<AccountUserEntity> {
//         const user = await this.accountUserService.findById(params.id);
//         this.throwUserNotFound(user);
//         return user;
//      }
   
  //check user exists by email
  async validate(email: string) {
    try {
      const users = await this.accountUserService.getUserByEmail(email);
      return "test???"
    } catch (e) {
      return false;
    }
  }
}
