import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProfileDocumentService } from './profile-document.service';
import { ProfileDocumentDto } from './dtos/profile-document.dto';
import { CreateProfileDetailDto } from './dtos/create-profile-detail.dto';
import { UserRoleGuard } from 'src/guards/user.role.guard';
import { AdminRoleGuard } from 'src/guards/admin.role.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('profile-document')
export class ProfileDocumentController {
  constructor(
    private readonly profileDocumentService: ProfileDocumentService,
  ) {}

  @UseGuards(UserRoleGuard)
  @Post('create-information')
  async createProfile(
    @Request() req: any,
    @Body() profileDto: ProfileDocumentDto,
  ) {
    const email = req['email'];
    return await this.profileDocumentService.CreateInformation(
      email,
      profileDto,
    );
  }

  @UseGuards(UserRoleGuard)
  @Post('create-profile')
  async createProfileDetail(
    @Request() req: any,
    @Body() profileDetailDto: CreateProfileDetailDto,
  ) {
    const email = req['email'];
    return await this.profileDocumentService.CreateProfile(
      email,
      profileDetailDto,
    );
  }

  @UseGuards(AdminRoleGuard)
  @Get('get-profile-list')
  async getProfileList() {
    return await this.profileDocumentService.getProfiles();
  }

  @UseGuards(RoleGuard)
  @Get('get-user')
  async getProfileByEmail(@Request() req: any) {
    const email = req['email'];
    return await this.profileDocumentService.getProfileByEmail(email);
  }

  @Get('get-freelancer/:email')
  async getFreelancerProfileByEmail(
    @Param('email') email: string,
  ): Promise<ProfileDocumentDto> {
    return await this.profileDocumentService.getFreelancerProfileByEmail(email);
  }
}

// @MessagePattern('get_user')
// handleGetUser(@Payload() get_user: string) {
//   return this.profileDocumentService.getFreelancerName(get_user);
// }

//  async onModuleInit() {
//   await this.consumer.connect();
// }
