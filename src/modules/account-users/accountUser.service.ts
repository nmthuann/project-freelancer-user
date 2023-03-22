import { HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { from, map, Observable, switchMap } from "rxjs";
// import { Observable } from "rxjs";
import { Repository } from "typeorm";
import { AuthService } from "../authentication/auth.service";
//import { LocalStrategy } from "../authentication/local.strategy";
import { AccountUserDto } from "./accountUser.dto";
import { AccountUserEntity } from "./accountUser.entity";
import { CreateAccountUserDto } from "./create-accountUser.dto";

import { LoginUserDto } from "./login-accountUser.dto";
import bcrypt from 'bcrypt';

export class AccountUserService{
    constructor(
    @InjectRepository(AccountUserEntity)
        private accountUserRepository: Repository<AccountUserEntity>,
       // private authService: AuthService,
       //private local: LocalStrategy
    ) {}


        async create(inputs: CreateAccountUserDto): Promise<AccountUserEntity> {
          // nếu đang thắc mắc là trên userRepository không có function createEntity?
          // đừng lo vì nó đã được mình định nghĩa trong modelRepository rồi 
          return await this.accountUserRepository.create(inputs);
        }
        
        async getUserByEmail(email: string): Promise<AccountUserEntity> {
          return await this.accountUserRepository.findOneBy({
                email: email
            });
        }

//Obvervabale
    // createAccountUser(createdUserDto: CreateAccountUserDto): Promise<AccountUserDto | undefined>{ // 
    //     const accountUserEntity = this.accountUserRepository.create(createdUserDto);
    //     return 
        // return accountUserEntity;
      //   return this.checkMailExists(accountUserEntity.email).pipe(
      //   switchMap((exists: boolean) => {
      //   if (!exists) {
      //       // hash pass
      //     return this.authService.hashPassword(accountUserEntity.password).pipe(
      //       switchMap((passwordHash: string) => {
      //         // Overwrite the user password with the hash, to store it in the db
      //         accountUserEntity.password = passwordHash;
      //         return from(this.accountUserRepository.save(accountUserEntity)).pipe(
      //           map((savedUser: AccountUserDto) => {
      //             const { password, ...user } = savedUser;
      //             return user;
      //           })
      //         )
      //       })
      //     )
      //   } else {
      //     throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      //   }
      // }))
   // }


    // async login(loginUserDto: LoginUserDto): Promise<any> {
    //   const findUserByEmail = await this.accountUserRepository.findOneBy({email: loginUserDto.email});
    //   //console.log(loginUserDto.password, findUserByEmail.password)
    //   if (findUserByEmail){
    //       const match = await (bcrypt.compare(loginUserDto.password, findUserByEmail.password));
    //       if (match){
    //         console.log("Login Successfull")
    //         return findUserByEmail;
    //       }
    //       else{
    //         console.log("Login fail")
    //         return null;
    //       }
    //   }
    //   console.log('Not found User')
    //   return null;
      
      //console.log(findUserByEmail.password, loginUserDto.password, match)
      //.then(result => {
      //   console.log("Login SuccessFully!@!!!!!!");
      // })
      // .catch(error => {
      //   console.error(error);
      // });
    // }
    // getAccountUsers(): Observable<AccountUserDto []> {
    //     return 
    // }

    // getAccountUserById(id: number): Observable<AccountUserDto> {
    //     return
    // }

    // private findAccountUserByEmail(email: string) {  
    //     return from(this.accountUserRepository.findOneBy({
    //         email: email
    //     }));
    // }

    // private validatePassword(password: string, storedPasswordHash: string)  {
    //     return this.authService.comparePasswords(password, storedPasswordHash);
    // }

    // private checkMailExists(email: string): Observable<boolean> {
    //     // if (!this.findAccountUserByEmail(email))
    //     //     return false;
    //     // return true;
    //     email = email.toLowerCase();
    //     return from(this.accountUserRepository.findOneBy({ email: email })).pipe(
    //     map((user: AccountUserDto) => {
    //         if (user) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     })
    //     )
    // }
}