import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './profile-document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountUserEntity } from '../account-users/account-user.entity';
import { InformationUserEntity } from '../infor-users/infor-user.entity';
import { ProfileUserEntity } from '../profile-users/profile-user.entity';
import { ProfileDocumentController } from './profile-document.controller';
import { ProfileDocumentService } from './profile-document.service';
import { AccountUserService } from '../account-users/account-user.service';
import { InformationUserService } from '../infor-users/infor-user.service';
import { ProfileUserService } from '../profile-users/profile-user.service';
import { JwtModule } from '@nestjs/jwt';
import { RoleGuard } from 'src/guards/role.guard';
import { UserRoleGuard } from 'src/guards/user.role.guard';
import { AdminRoleGuard } from 'src/guards/admin.role.guard';
import { AuthenticationMiddleware } from 'src/middlewares/authentication.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: 'JWT_SECRET_KEY',
      signOptions: { expiresIn: 60 },
    }),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    TypeOrmModule.forFeature([
      AccountUserEntity,
      InformationUserEntity,
      ProfileUserEntity,
    ]),
    // KafkaModule,
  ],
  controllers: [ProfileDocumentController],
  providers: [
    ProfileDocumentService,
    AccountUserService,
    InformationUserService,
    ProfileUserService,
    AdminRoleGuard,
    UserRoleGuard,
    RoleGuard,
  ],
})
export class ProfileDocumentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({
        path: 'profile-document/get-freelancer/:email',
        method: RequestMethod.GET,
      })
      .forRoutes(ProfileDocumentController);
  }
}
