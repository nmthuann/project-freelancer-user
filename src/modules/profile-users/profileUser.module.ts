import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileUserController } from './profileUser.controller';
import { ProfileUserEntity } from './profileUser.entity';
import { ProfileUserService } from './profileUser.service';
import { InformationUserService } from '../infor-users/inforUser.service';
import { InformationUserlModule } from '../infor-users/inforUser.module';
import { InformationUserEntity } from '../infor-users/inforUser.entity';
import { AccountUserEntity } from '../account-users/accountUser.entity';
import { AccountUserService } from '../account-users/accountUser.service';

@Module({
  imports:[TypeOrmModule.forFeature([ProfileUserEntity, InformationUserEntity, AccountUserEntity])],
  controllers: [ProfileUserController],
  providers: [ProfileUserService, InformationUserService, AccountUserService]
})
export class ProfileUserlModule {
}
