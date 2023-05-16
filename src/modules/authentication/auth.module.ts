import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccountUserService } from '../account-users/accountUser.service';
import { AuthController } from './auth.controller';
import { JsonWebTokenStrategy } from 'src/common/strategies/jwt.strategy';
import { RefreshJWTStrategy } from 'src/common/strategies/refresh.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountUserEntity } from '../account-users/accountUser.entity';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { KafkaModule } from 'src/modules/kafka/kafka.module';
import { AuthApiGatewayService } from './auth.api.service';
import { ProfileDocumentModule } from '../profile-document/profileDocument.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../profile-document/profileDocument.entity';
import { ProfileDocumentService } from '../profile-document/profileDocument.service';
import { InformationUserEntity } from '../infor-users/inforUser.entity';
import { InformationUserService } from '../infor-users/inforUser.service';
import { ProfileUserService } from '../profile-users/profileUser.service';
import { ProfileUserEntity } from '../profile-users/profileUser.entity';

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
        JsonWebTokenStrategy, 
        RefreshJWTStrategy, 
        AuthenticationGuard,
        AuthApiGatewayService,
        ProfileDocumentService
      ]
})
export class AuthModule {}