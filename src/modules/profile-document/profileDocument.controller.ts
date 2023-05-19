import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, OnModuleInit } from '@nestjs/common';
import { ProfileDocumentService } from './profileDocument.service';
import { ProfileDocumentDto } from './profile-document-dto/profileDocument.dto';
import { CreateProfileDetailDto } from './profile-document-dto/create-profileDetail.dto';
import { UserRoleGuard } from 'src/common/guards/user.role.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Consumer, Kafka } from 'kafkajs';

@Controller('profile-document')
export class ProfileDocumentController{//  implements OnModuleInit 

  // private readonly kafka = new Kafka({
  //   brokers: ['localhost:9092'],
  //   //onnectionTimeout: 6000,
  // });
  // private readonly consumer: Consumer = this.kafka.consumer({ groupId: 'auth-service' });


  constructor(
    private readonly profileDocumentService: ProfileDocumentService
  ) {}

  @UseGuards(UserRoleGuard)
  @Post('create-information')
  async createProfile(
    @Request() req: any, 
    @Body() profileDto: ProfileDocumentDto
  ){
    const email = req['email'];
    return await this.profileDocumentService.CreateInformation(email, profileDto);
  }
  
  @UseGuards(UserRoleGuard)
  @Post('create-profile')
  async createProfileDetail(
    @Request() req: any, 
    @Body() profileDetailDto: CreateProfileDetailDto
  ){
    const email = req['email'];
    return await this.profileDocumentService.CreateProfile(email, profileDetailDto);
  }

  @Get('profile-list')
  async getProfileList(){
    return await this.profileDocumentService.getProfiles()
  }

  // @MessagePattern('get_user')
  // handleGetUser(@Payload() get_user: string) {
  //   return this.profileDocumentService.getFreelancerName(get_user);
  // }

  //  async onModuleInit() {
  //   await this.consumer.connect();
  // }

}
