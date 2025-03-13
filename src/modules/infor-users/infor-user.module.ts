import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformationUserController } from './infor-user.controller';
import { InformationUserEntity } from './infor-user.entity';
import { InformationUserService } from './infor-user.service';
import { AccountUserService } from '../account-users/account-user.service';
import { AccountUserModule } from '../account-users/account-user.module';
import { AccountUserEntity } from '../account-users/account-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InformationUserEntity, AccountUserEntity]),
    AccountUserModule,
  ],
  controllers: [InformationUserController],
  providers: [InformationUserService, AccountUserService],
})
export class InformationUserlModule {}
