import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProfileDocumentService } from './profileDocument.service';
import { ProfileDocumentDto } from './profile-document-dto/profileDocument.dto';
import { CreateProfileDetailDto } from './profile-document-dto/create-profileDetail.dto';

@Controller('profile-document')
export class ProfileDocumentController {
    
  constructor(private readonly profileDocumentService: ProfileDocumentService) {}

  @Post('create-profile')
  async createProfile(@Body() profileDto: ProfileDocumentDto){
    console.log(profileDto.email, "Create Post Controller!")
    return await this.profileDocumentService.CreateProfile(profileDto);
  }
  
  @Post('create-profile-detail/:email')
  async createProfileDetail(@Param('email') email: string, @Body() profileDetailDto: CreateProfileDetailDto){
    console.log(email, "Create ProfileDetail Controller!")
    return await this.profileDocumentService.CreateProfileDetail(email, profileDetailDto);
  }

  @Get('profile-list')
  async getProfileList(){
    return await this.profileDocumentService.getProfiles()
  }

}
