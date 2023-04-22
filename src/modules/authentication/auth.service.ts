import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { AccountUserService } from "../account-users/accountUser.service";
import { AuthPayload } from "./auth-dto/auth.payload.interface";
import { LoginUserDto } from "../account-users/account-user-dto/login-accountUser.dto";
import { CreateAccountUserDto } from "../account-users/account-user-dto/create-accountUser.dto";
import { NextFunction, Request, Response } from "express";
import * as dotenv from 'dotenv';
import { RefreshJWTStrategy } from "src/common/strategies/refresh.strategy";
import { UpdateAccountUserDto } from "../account-users/account-user-dto/update-account.dto";
import { Tokens } from "src/common/bases/types/token.type";
import { Payload } from "src/common/bases/types/payload.type";
dotenv.config();
import * as nodemailer from 'nodemailer'
import { RefreshDto } from "./auth-dto/refresh.dto";
import { Role } from "src/common/bases/enums/role.enum";
import { AccessTokenDto } from "./auth-dto/accessToken.dto";
import { ChangePasswordDto } from "./auth-dto/changePass.dto";

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
  ) {}
  
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

  // async authentication(email: string, password: string): Promise<any> {
  //   const user = await this.accountUserService.getAccountUserByEmail(email);
  //   const checkPass = await this.comparePassword(password, user.password);

  //   if (!user || !checkPass) {
  //     return false;
  //   }
  //   return user;
  // }

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
  async getTokens(payload: Payload): Promise<Tokens> {
    const [jwt, refresh] = await Promise.all([
      this.jwtService.signAsync({payload}, {
          secret: 'JWT_SECRET_KEY',
          expiresIn: 60 * 15,
      }),
      this.jwtService.signAsync({payload}, {
          secret: 'REFRESH_JWT_SECRET_KEY',
          expiresIn: 60 * 60 * 24,
      })
    ]);

    return {
      access_token: jwt,
      refresh_token: refresh
    }
  }

  // // update Refresh token
  // async updateRefreshToken(email: string, refresh: string){
  //   const updateUserDto = new UpdateAccountUserDto();
  //   updateUserDto.email = email;
  //   updateUserDto.refresh_token = refresh;
  //   await this.accountUserService.updateAccountUser(email, updateUserDto);
  // }

  // hàm random password
  randomPassword(length: number, base: string){
    //const baseString = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    const getRandomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min)) + min;
    };
    let result = "";
    const baseLength = base.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = getRandomInt(0, baseLength);
      result += base[randomIndex];
    }
    return result;
  }
  


  /**
   *  ___________________________________________________________________________________
   *  Controller có -> Service có!
   * 
   */

  // đăng kí tài khoản -> Done!
  async registerUser(input: CreateAccountUserDto): Promise<AccessTokenDto | object> {
    const checkUser = await this.accountUserService.getAccountUserByEmail(input.email);
    if (checkUser) {
      // throw new HttpException(
      // { message: 'User already exists' },
      //   HttpStatus.BAD_REQUEST,
      // );
      return {message: 'User already exists'}
    }

    input.password = await bcrypt.hash(input.password, 12); // hash pass

    // create account
    const newUser = await this.accountUserService.createAccountUser(input);

    const tokens = await this.getTokens({
      email: newUser.email,
      role: Role.User
    });

    const update = new UpdateAccountUserDto(
      newUser.email,input.password,
      tokens.refresh_token,
      null
    );

    await this.accountUserService.updateAccountUser(newUser.email, update)
    console.log(newUser);

    const accessTokenDto = new AccessTokenDto(tokens.access_token);
    return accessTokenDto;
  }

  // đăng nhập 
  async login(input: LoginUserDto): Promise<AccessTokenDto | object> {
    // const checkUser = await this.accountUserService.CheckEmailExsit(input.email);
    const findUser = await this.accountUserService.getAccountUserByEmail(input.email);
    if (findUser){
      const checkPass = await this.comparePassword(input.password, findUser.password);
       if (!checkPass) {
        console.log('password wrong!')
        return {message: 'password wrong!'}
        // throw new HttpException(
        // { message: 'password wrong!' },
        // HttpStatus.BAD_REQUEST,
        // );
      }
    } 
    else{
      //throw new Error('email or Password Invalid!')
      // throw new HttpException(
        // { message: 'email or Password Invalid!' },
        // HttpStatus.BAD_REQUEST,
        // );
      return {message: 'email or Password Invalid!'}
      //UnauthorizedException('Credentials incorrect');
    }

    // write infor put in Payload
    const payload: Payload = {
      email: input.email,
      role: findUser.role
    };

    const tokens: Tokens = await this.getTokens(payload);

    findUser.refresh_token = tokens.refresh_token;
    await this.accountUserService.updateAccountUser(findUser.email, findUser);

    const accessTokenDto = new AccessTokenDto(tokens.access_token);
    return accessTokenDto;
  }

  // Done!
  async logout(email: string): Promise<boolean> {
    const checkUser = await this.accountUserService.getAccountUserByEmail(email);
    checkUser.refresh_token = null;
    await this.accountUserService.updateAccountUser(checkUser.email, checkUser);
    console.log(`${email} da dang xuat!`);
    return true;
  }

  // async refreshTokenold(email: string, rt: string): Promise<Tokens> {
  //   const checkUser = await this.accountUserService.getAccountUserByEmail(email);
  //   if (!checkUser || !checkUser.refresh_token) throw new ForbiddenException('Access Denied');
  //   const refreshMatches = this.jwtService.decode(rt);
  //   console.log("refreshToken func, refreshMatches: ", refreshMatches);
  //   if (!refreshMatches) throw new ForbiddenException('Access Denied');
  //   const tokens = await this.getTokens({email: checkUser.email, role: checkUser.role});
  //   await this.updateRefreshToken(checkUser.email, tokens.refresh_token);
  //   console.log("refreshToken func, tokens ", tokens);
  //   return tokens;
  // }

  async refreshToken(email: string): Promise<AccessTokenDto | object> {// refreshDto: RefreshDto
    // check cái access token ở trong cache - 
    const checkUser = await this.accountUserService.getAccountUserByEmail(email);
    if (!checkUser || !checkUser.refresh_token) {
      //throw new ForbiddenException('Access Denied');
      return {message: 'Access Denied!'}
    }
    const refreshMatches = this.jwtService.decode(checkUser.refresh_token);
    if (!refreshMatches){
      // throw new ForbiddenException('Access Denied');
      return {message: 'Access Denied!'}
    } 
    const tokens = await this.getTokens({email: checkUser.email, role: checkUser.role});
    checkUser.refresh_token = tokens.refresh_token;
    await this.accountUserService.updateAccountUser(checkUser.email, checkUser);
    
    const accessTokenDto = new AccessTokenDto(tokens.access_token);
    return accessTokenDto;
  }


  


  async forgetPassword(email: string): Promise<AccessTokenDto | object> {
    //throw new Error('Method not implemented.');
    
    const checkUser = await this.accountUserService.getAccountUserByEmail(email);
    if (!checkUser){
      // return 'Email không tồn tại!'
      throw new HttpException(
        { message: 'Email không tồn tại!' },
        HttpStatus.BAD_REQUEST,
      );
    }
    else{
      const baseString ="0123456789qwertyuiopasdfghjklzxcvbnm";
      //console.log(`Password: ${this.randomPassword(6, baseString)}`);

      var newPass = this.randomPassword(8, baseString);
      console.log("newPass", newPass);
      newPass = await bcrypt.hash(newPass, 12);

      const update = new UpdateAccountUserDto(
        checkUser.email, 
        newPass, 
        checkUser.refresh_token, 
        checkUser.infor
      );

      await this.accountUserService.updateAccountUser(checkUser.email, update)
      

      // const transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     user: 'thuanminh.2001286@gmail.com',
      //     pass: process.env.PasswordEmail
      //   }
      // });

      // const mailOptions = {
      //   from: 'thuanminh.2001286@gmail.com',
      //   to: 'nmt.m10.2862001@gmail.com',
      //   subject: 'Thay doi mat khau',
      //   text: `mật khẩu của bạn là: ${update.password}  `
      // };

      // transporter.sendMail(mailOptions, function(error, info){
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //   }
      // });

      const access_token = this.refreshToken(email);
      return access_token;
    }
  }

  async changePassword(
    email: string, 
    input: ChangePasswordDto
  ): Promise<AccessTokenDto | object>{

    const findUser = await this.accountUserService.getAccountUserByEmail(email);
    if (findUser){
      const checkPass = await this.comparePassword(input.currentPass, findUser.password);
       if (!checkPass) {
        console.log('password wrong!')
        return {message: 'password wrong!'}
      }
    } 
    else{
      return {message: 'email or Password Invalid!'}
    }

    input.newPass = await bcrypt.hash(input.newPass, 12);

    const tokens = await this.getTokens({email: email, role: findUser.role});

    findUser.password = input.newPass;

    await this.accountUserService.updateAccountUser(findUser.email, findUser);
    
    const accessTokenDto = new AccessTokenDto(tokens.access_token);
    return accessTokenDto;

    return ;
  }

  async ShowAccountList(){
    return await this.accountUserService.getAccountUsers();
  }
}