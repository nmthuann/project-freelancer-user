import { MiddlewareConsumer, Module } from '@nestjs/common';
//import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
//import { LocalStrategy } from './local.strategy';
import { AccountUserModule } from '../account-users/accountUser.module';
// import { AccountUserEntity } from '../account-users/accountUser.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccountUserService } from '../account-users/accountUser.service';
import { AuthController } from './auth.controller';
//import { LocalStrategy } from 'src/strategies/local.stategy';
import { JsonWebTokenStrategy } from 'src/strategies/jwt.strategy';
import { RefreshJWTStrategy } from 'src/strategies/refresh.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountUserEntity } from '../account-users/accountUser.entity';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';
import { RefreshGuard } from 'src/guards/refresh.guard';
import { KafkaModule } from 'src/kafka/kafka.module';
// import { CreateConsumer } from './create.consumer';
// import { AuthConsumerService } from './auth.consumer.service';
import { AuthApiGatewayService } from './auth.api.service';
//import { CreateConsumer } from './create.consumer';

@Module({
      imports: [
        KafkaModule,
        //AccountUserModule,
        JwtModule.register({
          secret: 'JWT_SECRET_KEY',
          signOptions: { expiresIn: 60},
        }),PassportModule,
        TypeOrmModule.forFeature([AccountUserEntity])
      ],
      controllers: [AuthController],
      providers: [AuthService, AccountUserService,
        JsonWebTokenStrategy, RefreshJWTStrategy, 
        AuthenticationGuard,
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        }, 
        AuthApiGatewayService
        //AuthConsumerService
      ]
})
export class AuthModule {}
//AuthenticationGuard, RefreshGuard,
//LocalStrategy,

//  {
//           provide: APP_GUARD,
//           useClass: RolesGuard,
//         },