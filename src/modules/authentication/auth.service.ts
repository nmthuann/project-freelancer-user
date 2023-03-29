import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
// import { from, Observable } from "rxjs";
// import { Repository } from "typeorm";
// import { AccountUserDto } from "../account-users/accountUser.dto";
// import { AccountUserEntity } from "../account-users/accountUser.entity";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { AccountUserService } from "../account-users/accountUser.service";
import { AuthPayload } from "./auth.payload.interface";
import { LoginUserDto } from "../account-users/login-accountUser.dto";
import { CreateAccountUserDto } from "../account-users/create-accountUser.dto";
import { NextFunction, Request, Response } from "express";
import * as dotenv from 'dotenv';
import { RefreshJWTStrategy } from "src/strategies/refresh.strategy";
import { UpdateAccountUserDto } from "../account-users/update-account.dto";
dotenv.config();

/**
 * 1. hashPassword
 * 2. comparePassword
 * 3. authentication
 * 4. authenToken
 * 5. getTokens
 * 6. updateRefreshToken
 */


@Injectable()
export class AuthService {
  
  constructor(
    private jwtService: JwtService,
    private accountUserService: AccountUserService,
  ) { 
    
  }
  //private refresh_Token_list: string []; // database???
  
  //function hash password
  async hashPassword(password: string): Promise<string> {
    //console.log(await bcrypt.hash(password, 10))
    return await (bcrypt.hash(password, '12'));
  }

  //function compare password param with user password in database
  async comparePassword(
    password: string,
    storePasswordHash: string,
    ): Promise<any> {
    return await bcrypt.compare(password, storePasswordHash);
  }

  async authentication(email: string, password: string): Promise<any> {
    const user = await this.accountUserService.getUserByEmail(email);
    const checkPass = await this.comparePassword(password, user.password);

    if (!user || !checkPass) {
      return false;
    }
    return user;
  }

  // function Middleware -> sẽ nằm ở API GateWay
  async authenToken(req: Request, res: Response, next: NextFunction) {
    //const authorizationHeader = req.headers['authorization'];
    const token = req.get('authorization').replace('Bearer', '').trim();
    console.log(token)
    if (!token) res.sendStatus(401);
    const author = await this.jwtService.verifyAsync(token);
    if (!author) {
      console.log("Loi author!");
      res.status(403);
    }else{
      console.log("Phan quyen thanh cong!"); 
      next();
    }
  }

  // gettoken -> [access,refresh]
  async getTokens(email: string): Promise<any> {
    const [jwt, refresh] = await Promise.all([
      this.jwtService.signAsync({
        email,
      },
        {
          secret: 'JWT_SECRET_KEY',
          expiresIn: 60 * 15,
        }),
      this.jwtService.signAsync({
        email,
      },
        {
          secret: 'REFRESH_JWT_SECRET_KEY',
          //expiresIn: 60 * 15,
        })
    ]);

    // /this.refresh_Token_list.push(refresh);
    return {
      access_token: jwt,
      refresh_token: refresh
    }
  }

  // update Refresh token
  async updateRefreshToken(email: string, refresh: string){
    // refresh -> hash????
    const updateUserDto = new UpdateAccountUserDto();
    updateUserDto.email = email;
    updateUserDto.refresh_token = refresh;
    await this.accountUserService.updateRefreshToken(email, updateUserDto);
  }

  /**
   *  ___________________________________________________________________________________
   *  Controller có -> Service có!
   * 
   */

  // đăng kí tài khoản -> Done!
  async registerUser(input: CreateAccountUserDto) {
    const checkUser = await this.accountUserService.getUserByEmail(input.email);
    if (checkUser) {
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log("test input.email:", input.email);
    console.log("test input.password: ", input.password);
    input.password = await bcrypt.hash(input.password, 12);
    console.log("test input.password(hash): ", input.password);
    const newUser = await this.accountUserService.createAccountUser(input);
    const tokens = await this.getTokens(newUser.email);
    console.log("refresh chua update: ",newUser.refresh_token);
    const update = new UpdateAccountUserDto()
    update.email = newUser.email;
    update.refresh_token = tokens.refresh_token;
    update.password = input.password;
    await this.accountUserService.updateRefreshToken(newUser.email, update)
    console.log(newUser);
    return tokens;
  }

  // đăng nhập 
  async login(input: LoginUserDto) {
    console.log('value of input', input);
    const checkUser = await this.accountUserService.getUserByEmail(input.email);
    console.log('value of checkUser', checkUser);
    if (checkUser) {
      const checkPass = await this.comparePassword(input.password, checkUser.password);
      console.log('value checkpass', checkPass);
      if (!checkPass) {
        throw new HttpException(
          { message: 'password wrong' },
          HttpStatus.BAD_REQUEST,);
      }
    }
    else {
      throw new UnauthorizedException('Credentials incorrect');
    }

    const payload: AuthPayload = {
      email: input.email,
    };
    // return { access_token: this.jwtService.sign(payload) };
    const tokens = await this.getTokens(payload.email);
    await this.updateRefreshToken(checkUser.email, tokens.refresh_token);
    return tokens;
  }

  // Done!
  async logout(email: string): Promise<boolean> {
    const checkUser = await this.accountUserService.getUserByEmail(email);
    await this.updateRefreshToken(checkUser.email, null); //???
    console.log("Ban da dang xuat!");
    return true;
  }

  // async refreshToken_1(req: Request, res: Response, next: NextFunction) {
  //   const refresh_token_check = req.body.token;
  //   if (!refresh_token_check) 
  //     res.sendStatus(401); // Unauthorize
  //   if(!this.refresh_Token_list.includes(refresh_token_check))
  //     res.sendStatus(403); // forbidden
  //   const author = await this.jwtService.verifyAsync(refresh_token_check);
  //   if (!author) {
  //     console.log("Loi author!");
  //     res.status(403);
  //   }else{
  //     console.log("Phan quyen thanh cong!"); 
  //     //const access_token = this.jwtService.signAsync(email)
  //     next();
  //   }
  // }

  // re
  async refreshToken(email: string, rt: string): Promise<any> {
    const checkUser = await this.accountUserService.getUserByEmail(email);
    console.log(checkUser);
    if (!checkUser || !checkUser.refresh_token) throw new ForbiddenException('Access Denied');

    const refreshMatches = this.jwtService.verifyAsync(checkUser.refresh_token);
    if (!refreshMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(checkUser.email);
    await this.updateRefreshToken(checkUser.email, tokens.refresh_token);
    return tokens;
  }

  forgetPassword() {
    throw new Error('Method not implemented.');
  }
}