import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { AccountUserEntity } from "./accountUser.entity";
import { CreateAccountUserDto } from "./create-accountUser.dto";
import { UpdateAccountUserDto } from "./update-account.dto";

@Injectable()
export class AccountUserService{
  constructor(
    @InjectRepository(AccountUserEntity)
      private accountUserRepository: Repository<AccountUserEntity>,
    ) {}

    async getAccountUsers(): Promise<AccountUserEntity[]> {
        return await this.accountUserRepository.find();
    }

    // Tạo Account
    async createAccountUser(inputs: CreateAccountUserDto): Promise<AccountUserEntity> {
          return await this.accountUserRepository.create(inputs);
    }
  
    // FindUserByEmail
    async getUserByEmail(email: string): Promise<AccountUserEntity> {
          return await this.accountUserRepository.findOneBy({
                email: email
            });
    }

    // Cập nhật Account
    async updateAccountUser(email: string, accountDto: CreateAccountUserDto){
      const userByEmail = await this.getUserByEmail(email);
      return await this.accountUserRepository.save({...userByEmail, ...accountDto});
    }

    // Cập nhật Account
    async updateRefreshToken(email: string, accountDto: UpdateAccountUserDto){
      const userByEmail = await this.getUserByEmail(email);
      return await this.accountUserRepository.save({...userByEmail, ...accountDto});
    }

    // delete Account: set status: active => off
    async offAccountUser(email: string){
      const userByEmail = await this.getUserByEmail(email);
      userByEmail.status = 'off';
      await this.accountUserRepository.save(userByEmail);
    }

    async deleteAccountUserByEmail(email : string): Promise<DeleteResult> {
        // const deleted = 
        // console.log(deleted)
        return this.accountUserRepository.softDelete(email);
    }
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