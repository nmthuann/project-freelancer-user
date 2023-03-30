import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationGuard } from './guards/authentication.guard';
import { RolesGuard } from './guards/roles.guard';
import { AccountUserEntity } from './modules/account-users/accountUser.entity';
import { AccountUserModule } from './modules/account-users/accountUser.module';
import { AuthModule } from './modules/authentication/auth.module';
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
        entities: [AccountUserEntity], //InformationUserEntity, ProfileUserEntity
        synchronize: false// fix: false -> migration
      }),  AuthModule, ],
  controllers: [AppController],
  providers: [AppService,
  // {
  //   provide: APP_GUARD,
  //   useClass: RolesGuard,
  // },
],
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

// {
//       provide: APP_GUARD,
//       useClass: AuthenticationGuard,
//     },