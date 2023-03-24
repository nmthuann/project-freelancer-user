import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

@Injectable()
export class AuthService{
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

  async authentication(email: string, password: string): Promise<any> {
    const user = await this.accountUserService.getUserByEmail(email);
    const checkPass = await this.comparePassword(password, user.password);

    if (!user || !checkPass) {
      return false;
    }
    return user;
  }

  async getTokens(email: string): Promise<any>{
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
            expiresIn: 60 * 15,
        })
    ]);

    // const accessToken = this.jwtService.signAsync({
    //   email,
    // },
    // {
    //   secret: 'JWT_SECRET_KEY',
    //   expiresIn: 60 * 15,
    // });

    return {
      access_token: jwt,
      refresh_token: refresh
    }
  }

  async registerUser(input: CreateAccountUserDto){
    const checkUser = await this.accountUserService.getUserByEmail(input.email);
    if (checkUser) {
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log("test 1:", input.email)
    console.log("test 2: ",input.password)
    input.password = await bcrypt.hash(input.password, 12);
    console.log("test 3: ",input.password)
    const newUser = await this.accountUserService.createAccountUser(input);
    const token = await this.getTokens(newUser.email);
    return token;
  }
  async login(user: LoginUserDto) {
    const payload: AuthPayload = {
      email: user.email,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  logout(){

  }

  refreshTokens(){

  }
}