import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { AccountUserEntity } from "./accountUser.entity";
import { CreateAccountUserDto } from "./account-user-dto/create-accountUser.dto";
import { UpdateAccountUserDto } from "./account-user-dto/update-account.dto";
import { UpdateRoleInAccountUserDto } from "./account-user-dto/update-accoutUser.dto";
import { Role } from "src/common/enums/role.enum";

/**
 * 1. getAccountUsers
 * 2. getAccountUserByEmail
 * 3. createAccountUser
 * 4. updateAccountUser
 * 5. deleteAccoutUserSetOff -> Status: off
 * 6. deleteAccountUserByEmail -> softDelete
 */

@Injectable()
export class AccountUserService{
  constructor(
    @InjectRepository(AccountUserEntity)
      private accountUserRepository: Repository<AccountUserEntity>,
    ) {}

  async getAccountUsers(): Promise<AccountUserEntity[]> {
      return await this.accountUserRepository.find();
  }

  // FindUserByEmail
  async getAccountUserByEmail(email: string): Promise<AccountUserEntity> {
    return await this.accountUserRepository.findOneBy({
      email: email
    });
  }

  // Tạo Account
  async createAccountUser(inputs: CreateAccountUserDto): Promise<AccountUserEntity> {
    return this.accountUserRepository.save(inputs);
  }
  

  // Cập nhật Account
  async updateAccountUserSetRole(email: string){
    const userByEmail = await this.getAccountUserByEmail(email);
    if (userByEmail.role != 'admin') return false;
    else{
      userByEmail.role = Role.User
      await this.accountUserRepository.save(userByEmail);
      return true;
    } 
  }

  // Cập nhật Account
  async updateAccountUser(email: string, accountDto: UpdateAccountUserDto){
    const userByEmail = await this.getAccountUserByEmail(email);
    return await this.accountUserRepository.save({...userByEmail, ...accountDto});
  }

  // delete Account: set status: active => off
  async deleteAccountUserSetOff(email: string): Promise<Boolean>{
    const userByEmail = await this.getAccountUserByEmail(email);
    userByEmail.status = 'off';
    await this.accountUserRepository.save(userByEmail);
    return true;
  }

  async deleteAccountUserByEmail(email : string): Promise<DeleteResult> {
      return this.accountUserRepository.softDelete(email);
  }
}
