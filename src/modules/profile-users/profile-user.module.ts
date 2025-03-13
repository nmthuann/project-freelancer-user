import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileUserController } from './profile-user.controller';
import { ProfileUserEntity } from './profile-user.entity';
import { ProfileUserService } from './profile-user.service';
import { InformationUserService } from '../infor-users/infor-user.service';
import { InformationUserEntity } from '../infor-users/infor-user.entity';
import { AccountUserEntity } from '../account-users/account-user.entity';
import { AccountUserService } from '../account-users/account-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProfileUserEntity,
      InformationUserEntity,
      AccountUserEntity,
    ]),
  ],
  controllers: [ProfileUserController],
  providers: [ProfileUserService, InformationUserService, AccountUserService],
})
export class ProfileUserlModule {}
