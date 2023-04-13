import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformationUserController } from './inforUser.controller';
import { InformationUserEntity } from './inforUser.entity';
import { InformationUserService } from './inforUser.service';

@Module({
  imports:[TypeOrmModule.forFeature([InformationUserEntity])],
  controllers: [InformationUserController],
  providers: [InformationUserService]
})
export class InformationUserlModule {
}
