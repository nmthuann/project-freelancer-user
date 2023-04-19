import { Body, Controller, HttpException, HttpStatus, 
  Post, UseGuards, Request, Get, Param, UsePipes,
   HttpCode, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountUserDto } from '../account-users/account-user-dto/create-accountUser.dto';
import { LocalAuthGuard } from 'src/common/guards/local.guard';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { ValidatorPipe } from 'src/common/pipes/validator.pipe';
import { LoginUserDto } from '../account-users/account-user-dto/login-accountUser.dto';
import { RefreshGuard } from 'src/common/guards/refresh.guard';
import { AuthGuard } from '@nestjs/passport';
import { Tokens } from '../../common/bases/types/token.type';
import { GetCurrentUser } from 'src/common/decorators/get-currentUser.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { TransformPipe } from 'src/common/pipes/transform.pipe';
import { GetCurrentEmailUser } from 'src/common/decorators/get-currentEmailUser.decorator';
import { Role } from 'src/common/bases/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Payload } from 'src/common/bases/types/payload.type';
import { GetCurrentRoleUser } from 'src/common/decorators/get-currentRoleUser.decorator';

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
  @Post('register') // check login hoặc chưa
  @UsePipes(new TransformPipe())
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() input: CreateAccountUserDto): Promise<Tokens> {
    return await this.authService.registerUser(input);
  }
  
  //handle login
  @Public()
  @Post('login')
  @UsePipes(new ValidatorPipe())
  async login(@Body() loginDto: LoginUserDto): Promise<Tokens> {
    console.log(loginDto, "Đã vừa đăng nhập!")
    return await this.authService.login(loginDto);
  }

  @UseGuards(AuthenticationGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentEmailUser() email: string): Promise<boolean>{
    return await this.authService.logout(email);
  }

  @Public()
  @UseGuards(RefreshGuard) // để ngăn ng khác thay đổi rf
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentEmailUser() email: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    console.log({
      email,
      refreshToken
    })
    return this.authService.refreshTokenold(email, refreshToken);
  }  
  
  @Post('forgetPassword/:email')
  forgetPassword(@Param('email') email: string){
    console.log("You choose the forgetPassword func!")
    return this.authService.forgetPassword(email);
  }

  
  //@UseGuards(AuthenticationGuard)
  @UseGuards(AuthenticationGuard)
  @Post('show-list')
  //@UseGuards(RolesGuard)
  //@Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async ShowAccountList(@GetCurrentRoleUser() role: string){
    if (role == 'user') 
      return "ERORR 403: Forbidden!";//'ban Khong co tuoi!';
    //console.log('Thuan sao ăn gi cute z !!! =)))')
    return await this.authService.ShowAccountList();
  }
}
