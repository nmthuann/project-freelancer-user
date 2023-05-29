import { MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccountUserService } from '../account-users/accountUser.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountUserEntity } from '../account-users/accountUser.entity';
import { KafkaModule } from 'src/modules/kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../profile-document/profileDocument.entity';
import { ProfileDocumentService } from '../profile-document/profileDocument.service';
import { InformationUserEntity } from '../infor-users/inforUser.entity';
import { InformationUserService } from '../infor-users/inforUser.service';
import { ProfileUserService } from '../profile-users/profileUser.service';
import { ProfileUserEntity } from '../profile-users/profileUser.entity';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';
import { AdminRoleGuard } from 'src/common/guards/admin.role.guard';
import { UserRoleGuard } from 'src/common/guards/user.role.guard';

@Module({
      imports: [
        JwtModule.register({
          secret: 'JWT_SECRET_KEY',
          signOptions: { expiresIn: 60},
        }),
        PassportModule,
        TypeOrmModule.forFeature([AccountUserEntity, InformationUserEntity, ProfileUserEntity]),
        KafkaModule,
        MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }])
        //AccountUserModule,  
        //ProfileDocumentModule
      ],
      controllers: [AuthController],
      providers: [
        AuthService, 
        AccountUserService,
        InformationUserService,
        ProfileUserService,
        // JsonWebTokenStrategy, 
        // RefreshJWTStrategy, 
        // AuthenticationGuard,
        // AuthApiGatewayService,
        ProfileDocumentService,
        AdminRoleGuard,
        UserRoleGuard, 
        // {
        //     provide: APP_GUARD,
        //     useClass: AdminRoleGuard  
        // },
      ]
})
export class AuthModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware)
        .exclude(
          { path: 'auth/login', method: RequestMethod.POST },
          { path: 'auth/register', method: RequestMethod.POST },
          { path: 'auth/show-list', method: RequestMethod.GET },
          // { path: 'auth/logout', method: RequestMethod.POST },
        )
        .forRoutes(AuthController);
    }
}