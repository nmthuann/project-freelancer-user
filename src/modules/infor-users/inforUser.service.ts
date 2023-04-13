import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { InformationUserEntity } from './inforUser.entity';
import { InformationUserDto } from './infor-user-dto/inforUser.dto';


@Injectable()
export class InformationUserService {
  constructor(
    @InjectRepository(InformationUserEntity)
    private readonly informationUserRepository: Repository<InformationUserEntity>) {}

    async getInformationUsers(): Promise<InformationUserEntity[]> {
        return await this.informationUserRepository.find();
    }

    async getByInformationUserId(id: number) {
        return await this.informationUserRepository.findOneById(id);
    }
      
    createInformationUser(informationDto: InformationUserDto) {
        return this.informationUserRepository.save(informationDto);
    }

    // async updateInformationUser(id: number, categoryDto: InformationUserDto): Promise<InformationUserDto>{
    //     return this.informationUserRepository.preload(categoryDto);
    // }

    async updateInformationUserById(id: number, informationDto: InformationUserDto){
        const cateUpdate = await this.informationUserRepository.findOneById(id);
        return this.informationUserRepository.save({...cateUpdate, ...informationDto});
    }

    async deleteInformationUserById(id: number): Promise<DeleteResult> {
        return await this.informationUserRepository.softDelete(id);
    }
}

