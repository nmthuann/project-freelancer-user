import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';
import { AdminRoleGuard } from 'src/common/guards/admin.role.guard';
import { UserRoleGuard } from 'src/common/guards/user.role.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthPostService } from './auth-post.service';
import { KafkaModule } from '../kafka/kafka.module';
import { ConsumerService } from '../kafka/consumer.service';
import { ProducerService } from '../kafka/producer.service';

@Module({
  imports: [
    JwtModule.register({
          secret: 'JWT_SECRET_KEY',
          signOptions: { expiresIn: 60},
        }),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    TypeOrmModule.forFeature([
      AccountUserEntity, 
      InformationUserEntity, 
      ProfileUserEntity
    ]),
    // KafkaModule,
  ],
  controllers: [ProfileDocumentController],
  providers: [
    ProfileDocumentService, 
    AccountUserService, 
    InformationUserService, 
    ProfileUserService,
    // AuthPostService,
    // ConsumerService,
    // ProducerService,
    AdminRoleGuard, 
    UserRoleGuard,
    RoleGuard,
  ],
})
export class ProfileDocumentModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware)
        .exclude({ path: 'profile-document/get-freelancer/:email', method: RequestMethod.GET },)
        .forRoutes(ProfileDocumentController);
    }
}
