import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountUserEntity } from './modules/account-users/accountUser.entity';
import { AccountUserlModule } from './modules/account-users/accountUser.module';
import { InformationUserEntity } from './modules/infor-users/inforUser.entity';
import { ProfileUserEntity } from './modules/profile-users/profileUser.entity';

@Module({
  imports: [TypeOrmModule.forRoot(
      {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: null,
        database: 'freelancerproject-user',
        entities: [InformationUserEntity, AccountUserEntity, ProfileUserEntity],
        synchronize: true, // fix: false -> migration
      })],
  controllers: [AppController],
  providers: [AppService,],
})

export class AppModule  {// implements NestModule
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .exclude(
  //       { path: 'users', method: RequestMethod.GET },
  //       { path: 'users', method: RequestMethod.POST },
  //       'cats/(.*)',)
  //     .forRoutes({path: 'posts', method: RequestMethod.GET} ); // .forRoutes(CatsController);
  // }

}