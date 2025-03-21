import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountUserEntity } from './modules/account-users/account-user.entity';
import { AccountUserModule } from './modules/account-users/account-user.module';
import { AuthModule } from './modules/auth/auth.module';
import { InformationUserEntity } from './modules/infor-users/infor-user.entity';
import { ProfileUserEntity } from './modules/profile-users/profile-user.entity';
import { InformationUserlModule } from './modules/infor-users/infor-user.module';
import { ProfileUserlModule } from './modules/profile-users/profile-user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileDocumentModule } from './modules/profile-document/profile-document.module';

@Module({
  imports: [
    //   ClientsModule.register([
    //   {
    //     name: 'POST_SERVICE',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: 'post-consumer',
    //         brokers: ['localhost:9092'],
    //       },
    //       consumer: {
    //         groupId: 'post-service'
    //       }
    //     }
    //   },
    // ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306, // parseInt(process.env.DB_PORT)
      username: 'root', // process.env.DB_USERNAME
      password: null,
      database: 'freelancerproject-user', //  process.env.DB_DATABASE_NAME
      entities: [AccountUserEntity, InformationUserEntity, ProfileUserEntity],
      synchronize: false, // fix: false -> migration
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
export default class AppModule {}
