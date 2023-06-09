import { Body, Controller, HttpException, HttpStatus, 
  Post, UseGuards,  Get, Param, UsePipes,
   HttpCode, Header, Request, OnModuleInit } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountUserDto } from '../account-users/account-user-dto/create-accountUser.dto';
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
//import { Payload } from 'src/common/bases/types/payload.type';
import { GetCurrentRoleUser } from 'src/common/decorators/get-currentRoleUser.decorator';
import { AccessTokenDto } from './auth-dto/accessToken.dto';
import { ChangePasswordDto } from './auth-dto/changePass.dto';
import { EventPattern, MessagePattern, Payload, } from '@nestjs/microservices';
import { AdminRoleGuard } from 'src/common/guards/admin.role.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Consumer, Kafka } from 'kafkajs';
//import { Request } from 'express';

/**
 * Authentication/ 
 * 1. Register
 * 2. Login
 * 3. Logout
 * 4. refresh
 * 5. forgetPassword
 */

@Controller('auth')
export class AuthController  {

  constructor(
    private authService: AuthService,
  ) {}
 
  //@Public()
  @Post('register') // check login hoặc chưa
  async registerUser(@Body() input: CreateAccountUserDto): Promise<Tokens | object> {
    return await this.authService.registerUser(input);
  }
  
  //@Public()
  @Post('login')
  async login(@Body() loginDto: LoginUserDto): Promise<Tokens | object | any> {
    console.log(loginDto, "Đã vừa đăng nhập!")
    return await this.authService.login(loginDto);
  }

  @UseGuards(RoleGuard)
  @Post('logout')
  async logout(@Request() req: any){
    const kq = await this.authService.logout(req['email']);
    if (kq == true)
    return {message: "Ban da dang xuat!"};
  }


  //@UseGuards(RefreshGuard)
  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: string): Promise<Tokens | any >{ //@Request() req: any
    return await this.authService.refreshToken(refreshToken);
  }


  // @UseGuards(AdminRoleGuard)
  @Get('show-list')
  async ShowAccountList(){
    // if (role == 'user') 
    //   return "ERORR 403: Forbidden!";
      //'ban Khong co tuoi!';
    //console.log('Thuan sao ăn gi cute z !!! =)))')
    return await this.authService.ShowAccountList();
  }

//@UseGuards(AuthenticationGuard)
  @Post('forget-password')
  async forgetPassword(@GetCurrentEmailUser() email: string): Promise<Tokens | object>{
    return await this.authService.forgetPassword(email);
  }

   //@UseGuards(AuthenticationGuard)
  @Post('change-password')
  async changePassword(
  @GetCurrentEmailUser() email: string,
  @Body() input: ChangePasswordDto,
  ): Promise<AccessTokenDto | object>{
    return await this.authService.changePassword(email, input);
  }

  
}

