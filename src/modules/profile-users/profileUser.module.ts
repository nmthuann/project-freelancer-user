import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileUserController } from './profileUser.controller';
import { ProfileUserEntity } from './profileUser.entity';
import { ProfileUserService } from './profileUser.service';

@Module({
  imports:[TypeOrmModule.forFeature([ProfileUserEntity])],
  controllers: [ProfileUserController],
  providers: [ProfileUserService]
})
export class ProfileUserlModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(CategoryMiddleware)
  //     .forRoutes('*');
  // }
}
