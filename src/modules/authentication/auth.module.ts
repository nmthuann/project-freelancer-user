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

@Module({
      imports: [
        //KafkaModule,
        JwtModule.register({
          secret: 'JWT_SECRET_KEY',
          signOptions: { expiresIn: 60},
        }),PassportModule,
        TypeOrmModule.forFeature([AccountUserEntity]),
        //AccountUserModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, AccountUserService,
        JsonWebTokenStrategy, RefreshJWTStrategy, 
        AuthenticationGuard,
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        }, 
        //AuthApiGatewayService
      ]
})
export class AuthModule {}