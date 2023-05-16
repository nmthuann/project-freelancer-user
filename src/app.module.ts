import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
  imports: [
    TypeOrmModule.forRoot({ 
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: null,
      database: process.env.DB_DATABASE_NAME,
      entities: [
        AccountUserEntity, 
        InformationUserEntity, 
        ProfileUserEntity
      ],
      synchronize: false// fix: false -> migration
    }),  
      AuthModule, 
      AccountUserModule, 
      InformationUserlModule, 
      ProfileUserlModule,
      MongooseModule.forRoot('mongodb://127.0.0.1:27017/UserFiver'), 
      ProfileDocumentModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})

export default class AppModule {

}






// implements NestModule {
  //   configure(consumer: MiddlewareConsumer) {
  //   consumer
  //       .apply(AuthenticationMiddleware)
  //       .exclude(
  //       { path: 'api/auth/login', method: RequestMethod.POST },
  //       { path: 'api/auth/register', method: RequestMethod.POST },
  //       //{ path: 'auth/refresh', method: RequestMethod.POST },
  //       //'auth/(.*)',
  //   )
  //       .forRoutes(ApiGatewayAuthController);
  // }