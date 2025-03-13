import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountUserController } from './account-user.controller';
import { AccountUserEntity } from './account-user.entity';
import { AccountUserService } from './account-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountUserEntity])],
  providers: [AccountUserService],
  controllers: [AccountUserController],
})
export class AccountUserModule {}
