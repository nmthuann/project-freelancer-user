import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountUserDto } from '../account-users/dtos/create-account-user.dto';
import { LoginUserDto } from '../account-users/dtos/login-account-user.dto';
import { AccessTokenDto } from './dtos/access-token.dto';
import { ChangePasswordDto } from './dtos/change-pass.dto';
import { Tokens } from 'src/common/types/token.type';
import { RoleGuard } from 'src/guards/role.guard';
import { GetCurrentEmailUser } from 'src/decorators/get-current-email-user.decorator';

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
  constructor(private readonly authService: AuthService) {}

  //@Public()
  @Post('register') // check login hoặc chưa
  async registerUser(
    @Body() input: CreateAccountUserDto,
  ): Promise<Tokens | object> {
    return await this.authService.registerUser(input);
  }

  //@Public()
  @Post('login')
  async login(@Body() loginDto: LoginUserDto): Promise<Tokens | object> {
    console.log(loginDto, 'Đã vừa đăng nhập!');
    return await this.authService.login(loginDto);
  }

  @UseGuards(RoleGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    const kq = await this.authService.logout(req['email']);
    if (kq) return { message: 'Ban da dang xuat!' };
  }

  //@UseGuards(RefreshGuard)
  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: string): Promise<Tokens> {
    return await this.authService.refreshToken(refreshToken);
  }

  // @UseGuards(AdminRoleGuard)
  @Get('show-list')
  async ShowAccountList() {
    // if (role == 'user')
    //   return "ERORR 403: Forbidden!";
    //'ban Khong co tuoi!';
    //console.log('Thuan sao ăn gi cute z !!! =)))')
    return await this.authService.ShowAccountList();
  }

  //@UseGuards(AuthenticationGuard)
  @Post('forget-password')
  async forgetPassword(
    @GetCurrentEmailUser() email: string,
  ): Promise<Tokens | object> {
    return await this.authService.forgetPassword(email);
  }

  //@UseGuards(AuthenticationGuard)
  @Post('change-password')
  async changePassword(
    @GetCurrentEmailUser() email: string,
    @Body() input: ChangePasswordDto,
  ): Promise<AccessTokenDto | object> {
    return await this.authService.changePassword(email, input);
  }
}
