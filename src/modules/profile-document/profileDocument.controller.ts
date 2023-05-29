import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, OnModuleInit } from '@nestjs/common';
import { ProfileDocumentService } from './profileDocument.service';
import { ProfileDocumentDto } from './profile-document-dto/profileDocument.dto';
import { CreateProfileDetailDto } from './profile-document-dto/create-profileDetail.dto';
import { UserRoleGuard } from 'src/common/guards/user.role.guard';
import { AdminRoleGuard } from 'src/common/guards/admin.role.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('profile-document')
export class ProfileDocumentController{

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


  @UseGuards(AdminRoleGuard)
  @Get('get-profile-list')
  async getProfileList(){
    return await this.profileDocumentService.getProfiles();
  }


  @UseGuards(RoleGuard)
  @Get('get-user') 
  async getProfileByEmail(@Request() req: any){
    const email = req['email'];
    return await this.profileDocumentService.getProfileByEmail(email);
  }


  // @UseGuards(RoleGuard)
  // @Get('get-user') 
  // async getProfileByEmailUser(@Param('email') email: string){
  //   return await this.profileDocumentService.getProfileByEmail(email);
  // }

}



  // @MessagePattern('get_user')
  // handleGetUser(@Payload() get_user: string) {
  //   return this.profileDocumentService.getFreelancerName(get_user);
  // }

  //  async onModuleInit() {
  //   await this.consumer.connect();
  // }