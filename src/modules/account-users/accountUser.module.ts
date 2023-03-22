import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JsonWebTokenStrategy } from 'src/strategies/jwt.strategy';
import { AuthModule } from '../authentication/auth.module';
import { AuthService } from '../authentication/auth.service';
import { AccountUserController } from './accountUser.controller';
import { AccountUserEntity } from './accountUser.entity';
import { AccountUserService } from './accountUser.service';

@Module({
      imports: [ TypeOrmModule.forFeature([AccountUserEntity])],
      controllers: [AccountUserController],
      providers: [AccountUserService, JsonWebTokenStrategy],
      exports: [AccountUserService],
    })
export class AccountUserModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(CategoryMiddleware)
  //     .forRoutes('*');
  // }
}
