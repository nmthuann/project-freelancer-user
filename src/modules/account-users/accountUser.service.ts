import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { AccountUserEntity } from "./accountUser.entity";
import { CreateAccountUserDto } from "./account-user-dto/create-accountUser.dto";
import { UpdateAccountUserDto } from "./account-user-dto/update-account.dto";
import { UpdateRoleInAccountUserDto } from "./account-user-dto/updateRole-accoutUser.dto";
import { Role } from "src/common/bases/enums/role.enum";
import { InformationUserEntity } from "../infor-users/inforUser.entity";
import { AccountUserDto } from "./account-user-dto/accountUser.dto";

/**
 * 1. getAccountUsers
 * 2. getAccountUserByEmail
 * 3. createAccountUser
 * 4. updateAccountUser
 * 5. deleteAccoutUserSetOff -> Status: off
 * 6. deleteAccountUserByEmail -> softDelete
 * 7. CheckMailExsit
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
  async getAccountUserByEmail(email: string): Promise<AccountUserDto> {
    try {
      const user = await this.accountUserRepository.findOneBy({ 
        email: email
      });
      return user;
    } catch (error) {
      throw new NotFoundException(`Error getting account user by email: ${email}. ${error.message}`)
    }
  }

    async CheckEmailExsit(email: string): Promise<boolean>{
    const findUser = await this.getAccountUserByEmail(email);
    if (!findUser) return false;
    return true
  }


  // Create Account
  async createAccountUser(inputs: CreateAccountUserDto): Promise<CreateAccountUserDto > {
    return await this.accountUserRepository.save(inputs);
  }
  

  // Cập nhật Account
  async updateAccountUserSetRole(email: string){
    const findUser = await this.CheckEmailExsit(email);
    if (!findUser) return false;
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

  async getAccountByInforId(infor_id: number): Promise<AccountUserDto>{
    const getAccByInforId = await this.accountUserRepository
    .createQueryBuilder('accountusers')
    .innerJoinAndSelect('accountusers.inforInforId', 'infor')
    .where('infor.infor_id = :infor_id', {infor_id : infor_id })
    .getOne();
    console.log("getAccByInforId",getAccByInforId)
    return getAccByInforId;
  }
}
