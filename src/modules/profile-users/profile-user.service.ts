import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ProfileUserEntity } from './profile-user.entity';
import { ProfileUserDto } from './dtos/profile-user.dto';
import { InformationUserService } from '../infor-users/infor-user.service';
import { UpdateProfileUserDto } from './dtos/update-profile-user.dto';

@Injectable()
export class ProfileUserService {
  constructor(
    @InjectRepository(ProfileUserEntity)
    private readonly profileUserRepository: Repository<ProfileUserEntity>,
    private readonly informationUserService: InformationUserService,
  ) {}

  async getProfileUsers(): Promise<ProfileUserDto[]> {
    return await this.profileUserRepository.find();
  }

  async getProfileUserById(id: number) {
    return this.profileUserRepository.findOneById(id);
  }

  async createProfileUser(profileDto: ProfileUserDto) {
    // cách xử lý này không hay
    try {
      await this.profileUserRepository.save(profileDto);
      console.log('lưu xong!');
    } catch (error) {
      return 'Profile đã tồn tại';
    }

    const newProfile = await this.profileUserRepository
      .createQueryBuilder('profileusers')
      .innerJoinAndSelect('profileusers.infor', 'infor')
      .where('infor.infor_id = :infor_id', {
        infor_id: profileDto.infor.infor_id,
      })
      .getOne();

    const findInfor = await this.informationUserService.getInformationUserById(
      profileDto.infor.infor_id,
    );
    findInfor.profile = newProfile;
    await this.informationUserService.updateInformationUserById(
      profileDto.infor.infor_id,
      findInfor,
    );
    return newProfile;
  }

  async getInforIdByProfileId(email: string): Promise<number> {
    const findInfor = await this.informationUserService.getInforIdByEmail(
      email,
    );
    const findProfile = await this.profileUserRepository
      .createQueryBuilder('profileusers')
      .innerJoinAndSelect('profileusers.inforInforId', 'infor')
      .where('infor.infor_id = :infor_id', { infor_id: findInfor })
      .getOne();
    return findProfile.profile_id;
  }

  async getProfileIdByEmail(email: string): Promise<number> {
    // chưa check nhìu case
    const findInfor = await this.informationUserService.getInforIdByEmail(
      email,
    );
    const findProfile = await this.profileUserRepository
      .createQueryBuilder('profileusers')
      .innerJoinAndSelect('profileusers.infor', 'infor')
      .where('infor.infor_id = :infor_id', { infor_id: findInfor })
      .getOne();
    return findProfile.profile_id;
  }

  async updateProfileUserById(id: number, profileDto: UpdateProfileUserDto) {
    const cateUpdate = await this.profileUserRepository.findOneById(id);
    return this.profileUserRepository.save({ ...cateUpdate, ...profileDto });
  }

  async deleteProfileUserById(id: number): Promise<DeleteResult> {
    return this.profileUserRepository.softDelete(id);
  }
}
