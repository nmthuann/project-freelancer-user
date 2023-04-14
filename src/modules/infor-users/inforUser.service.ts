import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { InformationUserEntity } from './inforUser.entity';
import { CreateInformationUserDto } from './infor-user-dto/create-inforUser.dto';
import { AccountUserService } from '../account-users/accountUser.service';
import { UpdateInformationUserDto } from './infor-user-dto/update-inforUser.dto';
import { InformationUserDto } from './infor-user-dto/inforUser.dto';


@Injectable()
export class InformationUserService {
  constructor(
    @InjectRepository(InformationUserEntity)
    private readonly informationUserRepository: Repository<InformationUserEntity>,
      private readonly accountUserService: AccountUserService,
      ) {}

    async getInformationUsers(): Promise<InformationUserDto[]> {
        return await this.informationUserRepository.find();
    }

    async getInformationUserById(id: number) : Promise<InformationUserDto>{
        return await this.informationUserRepository.findOneById(id);
    }

    async getInforIdByEmail(email: string): Promise<number>{//: Promise<InformationUserEntity>
            const findInfor = await this.informationUserRepository
            .createQueryBuilder('informationusers')
            .innerJoinAndSelect('informationusers.account', 'account')
            .where('account.email = :email', { email: email })
            .getOne();
            if (findInfor == null){
                console.log ("ko tim thay inforid")
                return 0
            }else{
                console.log("check - getInforIdByEmail: ",findInfor)
                return findInfor.infor_id;
            }
    }
      
    async createInformationUser(information: CreateInformationUserDto){
        // cách xử lý này không hay
        try {
            await this.informationUserRepository.save(information);
            console.log("lưu xong!")
        } catch (error) {
            return "Infor đã tồn tại";
        }

        const newInfor = await this.informationUserRepository
        .createQueryBuilder('informationusers')
        .innerJoinAndSelect('informationusers.account', 'account')
        .where('account.email = :email', { email: information.account.email })
        .getOne();

        console.log("findAccount: ",newInfor);
        const findAccount = await this.accountUserService.getAccountUserByEmail(information.account.email)
        console.log("findAccount: ",findAccount)
        console.log(newInfor.infor_id);
        findAccount.infor = newInfor
        await this.accountUserService.updateAccountUser(information.account.email, findAccount);
        return newInfor;
    }

    async updateInformationUserById(id: number, informationDto: UpdateInformationUserDto): Promise<InformationUserDto>{
        const cateUpdate = await this.informationUserRepository.findOneById(id);
        return this.informationUserRepository.save({...cateUpdate, ...informationDto});
    }

    async deleteInformationUserById(id: number): Promise<DeleteResult> {
        return await this.informationUserRepository.softDelete(id);
    }
}

