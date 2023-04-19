import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationGuard } from './common/guards/authentication.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AccountUserEntity } from './modules/account-users/accountUser.entity';
import { AccountUserModule } from './modules/account-users/accountUser.module';
import { AuthModule } from './modules/authentication/auth.module';
import { InformationUserEntity } from './modules/infor-users/inforUser.entity';
import { ProfileUserEntity } from './modules/profile-users/profileUser.entity';
import { InformationUserlModule } from './modules/infor-users/inforUser.module';
import { ProfileUserlModule } from './modules/profile-users/profileUser.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileDocumentModule } from './modules/profile-document/profileDocument.module';

@Module({
  imports: [TypeOrmModule.forRoot(
      { 
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: null,
        database: 'freelancerproject-user',
        entities: [AccountUserEntity, InformationUserEntity, ProfileUserEntity], //InformationUserEntity, ProfileUserEntity
        synchronize: false// fix: false -> migration
      }),  AuthModule, 
      AccountUserModule, InformationUserlModule, ProfileUserlModule,
      MongooseModule.forRoot('mongodb://127.0.0.1:27017/UserFiver'), ProfileDocumentModule,
     ],
  controllers: [AppController],
  providers: [AppService,],
})

export class AppModule  {// implements NestModule
}