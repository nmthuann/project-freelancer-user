import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformationUserController } from './inforUser.controller';
import { InformationUserEntity } from './inforUser.entity';
import { InformationUserService } from './inforUser.service';
import { AccountUserService } from '../account-users/accountUser.service';
import { AccountUserModule } from '../account-users/accountUser.module';
import { AccountUserEntity } from '../account-users/accountUser.entity';

@Module({
  imports:[TypeOrmModule.forFeature([InformationUserEntity, AccountUserEntity]), AccountUserModule],
  controllers: [InformationUserController],
  providers: [InformationUserService, AccountUserService]
})
export class InformationUserlModule {
}
