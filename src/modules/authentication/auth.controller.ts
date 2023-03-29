import { Body, Controller, HttpException, HttpStatus, 
  Post, UseGuards, Request, Get, Param, UsePipes,
   HttpCode, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountUserDto } from '../account-users/create-accountUser.dto';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { ValidatorPipe } from 'src/pipes/validator.pipe';
import { LoginUserDto } from '../account-users/login-accountUser.dto';
import { RefreshGuard } from 'src/guards/refresh.guard';
import { AuthGuard } from '@nestjs/passport';
import { Tokens } from '../../common/types/token.type';
import { GetCurrentUser } from 'src/common/decorators/get-currentUser.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { TransformPipe } from 'src/pipes/transform.pipe';
import { GetCurrentEmailUser } from 'src/common/decorators/get-currentEmailUser.decorator';

/**
 * Authentication/ 
 * 1. Register
 * 2. Login
 * 3. Logout
 * 4. refresh
 * 5. forgetPassword
 */

@Controller('auth')
export class AuthController {
  constructor(
    //private accountUserService: AccountUserService,
    private authService: AuthService,
  ) {}

 //fucntion register user
 
  @Public()
  @Post('register')
  @UsePipes(new TransformPipe())
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() input: CreateAccountUserDto): Promise<Tokens> {
    return await this.authService.registerUser(input);
  }
  
  //handle login
  //@UseGuards(AuthenticationGuard)
  @Post('login')
  @UsePipes(new ValidatorPipe())
  async login(@Body() loginDto: LoginUserDto): Promise<Tokens> {
    return await this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentEmailUser() email: string): Promise<boolean>{
    return await this.authService.logout(email);
  }

  @Public()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentEmailUser() email: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ){
    this.authService.refreshToken(email, refreshToken);
  }  
  
  @Post()
  forgetPassword(){
    return this.authService.forgetPassword();
  }
}
