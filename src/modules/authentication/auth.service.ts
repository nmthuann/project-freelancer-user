import { Injectable } from "@nestjs/common";
import { from, Observable } from "rxjs";
import { Repository } from "typeorm";
import { AccountUserDto } from "../account-users/accountUser.dto";
import { AccountUserEntity } from "../account-users/accountUser.entity";
import bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { AccountUserService } from "../account-users/accountUser.service";
import { AuthPayload } from "./auth.payload.interface";

@Injectable()
export class AuthService{
     constructor(
    private jwtService: JwtService,
    private accountUserService: AccountUserService,
  ) {}

  //function hash password
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
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
    const check = await this.comparePassword(password, user.password);

    if (!user || !check) {
      return false;
    }

    return user;
  }

  async login(user: AccountUserEntity) {
    const payload: AuthPayload = {
      email: user.email,
    //   id: user.id,
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}