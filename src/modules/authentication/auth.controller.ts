import { Body, Controller, HttpException, HttpStatus, 
  Post, UseGuards, Request, Get, Param, UsePipes, HttpCode } from '@nestjs/common';
import { AccountUserService } from '../account-users/accountUser.service';
import { AuthService } from './auth.service';
import { AccountUserDto } from '../account-users/accountUser.dto';
import { CreateAccountUserDto } from '../account-users/create-accountUser.dto';
import { LocalAuthGuard } from 'src/guards/auth.guard';
import { AuthenticationGuard } from 'src/guards/local.guard';
import { ValidatorPipe } from 'src/pipes/validator.pipe';
import { LoginUserDto } from '../account-users/login-accountUser.dto';
import { RefreshGuard } from 'src/guards/refresh.guard';

/**
 * Authentication/ 
 * 1. Register
 * 2. Login
 */

@Controller('auth')
export class AuthController {
  constructor(
    //private accountUserService: AccountUserService,
    private authService: AuthService,
  ) {}

 //fucntion register user
  @Post('/register')
  @UsePipes(new ValidatorPipe())
  async registerUser(@Body() input: CreateAccountUserDto): Promise<any> {
    // check mail
    return this.authService.registerUser(input)
    
  }
  
  //handle login
  //@UseGuards(AuthenticationGuard)
  @Post('/login')
  @UsePipes(new ValidatorPipe())
  async login(@Body() loginDto: LoginUserDto): Promise<any> {
    return this.authService.login(loginDto);
  }
  
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Param() email: string){
    this.authService.logout(email);
  }

  //@Public()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @Param() email: string,
    @Request() refreshToken: string,
  ){
    this.authService.refreshToken_2(email, refreshToken);
  }  
  

  @Post()
  forgetPassword(){
    return this.authService.forgetPassword();
  }
  //check user exists by email
  // async validateEmail(email: string) {
  //   try {
  //     const findUserByEmail = await this.accountUserService.getUserByEmail(email);
  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // }
}

//   @UseGuards(AuthenticationGuard)
//   @Get('users/:id')
//     async getUserById(@Param() params): Promise<AccountUserEntity> {
//         const user = await this.accountUserService.findById(params.id);
//         this.throwUserNotFound(user);
//         return user;
//      }