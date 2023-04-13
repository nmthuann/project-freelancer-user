import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountUserController } from './accountUser.controller';
import { AccountUserEntity } from './accountUser.entity';
import { AccountUserService } from './accountUser.service';

@Module({
      imports: [TypeOrmModule.forFeature([AccountUserEntity])],

      providers: [AccountUserService],
      controllers: [AccountUserController],
      
      //exports: [AccountUserService],
    })
export class AccountUserModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(CategoryMiddleware)
  //     .forRoutes('*');
  // }
}
