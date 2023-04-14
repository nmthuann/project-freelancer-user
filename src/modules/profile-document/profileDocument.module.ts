import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './profileDocument.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountUserEntity } from '../account-users/accountUser.entity';
import { InformationUserEntity } from '../infor-users/inforUser.entity';
import { ProfileUserEntity } from '../profile-users/profileUser.entity';
import { ProfileDocumentController } from './profileDocument.controller';
import { ProfileDocumentService } from './profileDocument.service';
import { AccountUserService } from '../account-users/accountUser.service';
import { InformationUserService } from '../infor-users/inforUser.service';
import { ProfileUserService } from '../profile-users/profileUser.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  TypeOrmModule.forFeature([AccountUserEntity, InformationUserEntity, ProfileUserEntity])],
  controllers: [ProfileDocumentController],
  providers: [ProfileDocumentService, AccountUserService, InformationUserService, ProfileUserService],
})
export class ProfileDocumentModule {}

