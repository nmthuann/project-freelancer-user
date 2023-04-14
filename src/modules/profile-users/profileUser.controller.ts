import { Body, Controller, Delete, Get, Param, Post, Put,
     Req, UsePipes, NestMiddleware, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ValidatorPipe } from 'src/pipes/validator.pipe';
import { CreateProfileUserDto } from './profile-user-dto/create-profileUser.dto';
import { ProfileUserService } from './profileUser.service';
import { ProfileUserDto } from './profile-user-dto/profileUser.dto';

// working with DTO
@Controller('profile-user') 
export class ProfileUserController  {
    constructor(private profileUserService: ProfileUserService){}

    @Get('ProfileUsers')
    async getProfileUsers() {
        return await this.profileUserService.getProfileUsers();
    }
    
    @Post('create')
    @UsePipes(new ValidatorPipe())
    createProfileUser(@Body() profileDto: ProfileUserDto) {
        return this.profileUserService.createProfileUser(profileDto);
    }

    @Put('update/:id')
    async updateProfileUserById(@Param('id') id: number,
     @Body() profileDto: ProfileUserDto,): Promise<ProfileUserDto> {
        return this.profileUserService.updateProfileUserById(id,profileDto);
    }

    @Delete('delete/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteProfileUserById(@Param('id') id: number): Promise<void> {
        console.log(this.profileUserService.deleteProfileUserById(id));
    }

    @Get(':id')
    //@Patch()
    async getProfileUserById(@Param('id') id: number): Promise<CreateProfileUserDto> {
        return await this.profileUserService.getProfileUserById(id);
    }
}


