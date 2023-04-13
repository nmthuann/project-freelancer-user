import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ProfileUserEntity } from './profileUser.entity';
import { CreateProfileUserDto } from './profile-user-dto/create-profileUser.dto';
import { UpdateProfileUserDto } from './profile-user-dto/profileUser.dto';

@Injectable()
export class ProfileUserService {
  constructor(
    @InjectRepository(ProfileUserEntity)
    private readonly profileUserRepository: Repository<ProfileUserEntity>) {}

    async getProfileUsers(): Promise<ProfileUserEntity[]> {
        return this.profileUserRepository.find();
    }

    async getProfileUserById(id: number) {
        return this.profileUserRepository.findOneById(id);
    }
      
    async createProfileUser(profileDto: CreateProfileUserDto) {
        return this.profileUserRepository.save(profileDto);
    }

    // async updateCategory(id: number, categoryDto: CategoryDto): Promise<CategoryDto>{
    //     return this.categoryRepository.preload(categoryDto);
    // }

    async updateProfileUserById(id: number, profileDto: UpdateProfileUserDto){
        const cateUpdate = await this.profileUserRepository.findOneById(id);
        return this.profileUserRepository.save({...cateUpdate, ...profileDto});
    }

    async deleteProfileUserById(id: number): Promise<DeleteResult> {
        return this.profileUserRepository.softDelete(id);
    }
}