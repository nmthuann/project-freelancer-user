import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { AccountUserService } from "../account-users/accountUser.service";
import { AuthPayload } from "./auth-dto/auth.payload.interface";
import { LoginUserDto } from "../account-users/account-user-dto/login-accountUser.dto";
import { CreateAccountUserDto } from "../account-users/account-user-dto/create-accountUser.dto";
import { NextFunction, Request, Response } from "express";
import * as dotenv from 'dotenv';
import { RefreshJWTStrategy } from "src/strategies/refresh.strategy";
import { UpdateAccountUserDto } from "../account-users/account-user-dto/update-account.dto";
import { Tokens } from "src/common/types/token.type";
import { Payload } from "src/common/types/payload.type";
dotenv.config();
import nodemailer from 'nodemailer';
import { RefreshDto } from "./auth-dto/refresh.dto";

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
    const user = await this.accountUserService.getAccountUserByEmail(email);
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
  async getTokens(payload: Payload): Promise<any> {
    const [jwt, refresh] = await Promise.all([
      this.jwtService.signAsync({
        payload
      },
        {
          secret: 'JWT_SECRET_KEY',
          expiresIn: 60 * 15,
        }),
      this.jwtService.signAsync({
        payload
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
    await this.accountUserService.updateAccountUser(email, updateUserDto);
  }

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
  async registerUser(input: CreateAccountUserDto) {
    const checkUser = await this.accountUserService.getAccountUserByEmail(input.email);
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
    const tokens = await this.getTokens({email: newUser.email, role: newUser.role});
    console.log("refresh chua update: ",newUser.refresh_token);
    const update = new UpdateAccountUserDto()
    update.email = newUser.email;
    update.refresh_token = tokens.refresh_token;
    update.password = input.password;
    await this.accountUserService.updateAccountUser(newUser.email, update)
    console.log(newUser);
    return tokens;
  }

  // đăng nhập 
  async login(input: LoginUserDto) {
    console.log('value of input: ', input);
    const checkUser = await this.accountUserService.getAccountUserByEmail(input.email);
    console.log('value of checkUser: ', checkUser);
    if (checkUser) {
      const checkPass = await this.comparePassword(input.password, checkUser.password);
      console.log('value checkpass: ', checkPass);
      if (!checkPass) {
        throw new HttpException(
          { message: 'password wrong' },
          HttpStatus.BAD_REQUEST,);
      }
    }
    else {
      throw new UnauthorizedException('Credentials incorrect');
    }

    const payload: Payload = {
      email: input.email,
      role: checkUser.role
    };
    // return { access_token: this.jwtService.sign(payload) };
    //const tokens = await this.getTokens(payload.email);
    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(checkUser.email, tokens.refresh_token);
    return tokens;
  }

  // Done!
  async logout(email: string): Promise<boolean> {
    const checkUser = await this.accountUserService.getAccountUserByEmail(email);
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

  async refreshTokenold(email: string, rt: string): Promise<Tokens> {
     console.log({
      email,
      rt
    });
    const checkUser = await this.accountUserService.getAccountUserByEmail(email);
    //console.log(checkUser);
    
    if (!checkUser || !checkUser.refresh_token) throw new ForbiddenException('Access Denied');

    //const test = 'REFRESH_JWT_SECRET_KEY';//process.env.REFRESH_SECRET
    const refreshMatches = this.jwtService.decode(rt);
    console.log("refreshToken func, refreshMatches: ", refreshMatches);
    if (!refreshMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens({email: checkUser.email, role: checkUser.role});
    await this.updateRefreshToken(checkUser.email, tokens.refresh_token);
    console.log("refreshToken func, tokens ", tokens);
    return tokens;
  }

  async refreshToken(refreshDto: RefreshDto): Promise<Tokens> {
    const checkUser = await this.accountUserService.getAccountUserByEmail(refreshDto.email);
    if (!checkUser || !checkUser.refresh_token) throw new ForbiddenException('Access Denied');
    const refreshMatches = this.jwtService.decode(refreshDto.current_refresh_Token);
    console.log("refreshToken func, refreshMatches: ", refreshMatches);
    if (!refreshMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens({email: checkUser.email, role: checkUser.role});
    await this.updateRefreshToken(checkUser.email, tokens.refresh_token);
    console.log("refreshToken func, tokens ", tokens);
    return tokens;
  }

  async forgetPassword(email: string) {
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
      console.log(`Password: ${this.randomPassword(6, baseString)}`);

      const update = new UpdateAccountUserDto()
      update.email = checkUser.email;
      update.refresh_token = checkUser.refresh_token;
      update.password = this.randomPassword(6, baseString); // đổi pass
      update.password = await bcrypt.hash(update.password, 12); // hash pass
      await this.accountUserService.updateAccountUser(checkUser.email, update)
      console.log(update);

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nmt.m10.2862001@gmail.com',
          pass: process.env.PasswordEmail
        }
      });

      var mailOptions = {
        from: 'nmt.m10.2862001@gmail.com',
        to: email,
        subject: 'Thay doi mat khau',
        text: `mật khẩu của bạn là: ${update.password}  `
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      return update;
    }
  }

  changePassword(){
    return 'Chua hoan thanh !'
  }

  async ShowAccountList(){
    return await this.accountUserService.getAccountUsers();
  }
}