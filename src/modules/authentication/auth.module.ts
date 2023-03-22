import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
//import { LocalStrategy } from './local.strategy';
import { AccountUserModule } from '../account-users/accountUser.module';
import { AccountUserEntity } from '../account-users/accountUser.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccountUserService } from '../account-users/accountUser.service';
import { AuthController } from './auth.controller';

@Module({
      imports: [
        AccountUserModule,
        TypeOrmModule.forFeature([AccountUserEntity]),
        PassportModule,
         JwtModule.register({
         secret: 'JWT_SECRET_KEY',
         signOptions: { expiresIn: '60m' },
       }),
      ],
      providers: [AuthService, AccountUserService],
      controllers: [AuthController],
    })
export class AuthModule {}
