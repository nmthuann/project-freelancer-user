import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccountUserService } from '../account-users/account-user.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountUserEntity } from '../account-users/account-user.entity';
import { KafkaModule } from 'src/modules/kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Profile,
  ProfileSchema,
} from '../profile-document/profile-document.entity';
import { ProfileDocumentService } from '../profile-document/profile-document.service';
import { InformationUserEntity } from '../infor-users/infor-user.entity';
import { InformationUserService } from '../infor-users/infor-user.service';
import { ProfileUserService } from '../profile-users/profile-user.service';
import { ProfileUserEntity } from '../profile-users/profile-user.entity';
import { AdminRoleGuard } from 'src/guards/admin.role.guard';
import { UserRoleGuard } from 'src/guards/user.role.guard';
import { AuthenticationMiddleware } from 'src/middlewares/authentication.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: 'JWT_SECRET_KEY',
      signOptions: { expiresIn: 60 },
    }),
    PassportModule,
    TypeOrmModule.forFeature([
      AccountUserEntity,
      InformationUserEntity,
      ProfileUserEntity,
    ]),
    KafkaModule,
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountUserService,
    InformationUserService,
    ProfileUserService,
    ProfileDocumentService,
    AdminRoleGuard,
    UserRoleGuard,
    // {
    //     provide: APP_GUARD,
    //     useClass: AdminRoleGuard
    // },
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/show-list', method: RequestMethod.GET },
        // { path: 'auth/logout', method: RequestMethod.POST },
      )
      .forRoutes(AuthController);
  }
}
