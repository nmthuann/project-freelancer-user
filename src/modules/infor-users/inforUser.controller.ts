import { Body, Controller, Delete, Get, Param, Post, Put,
     Req, UsePipes, NestMiddleware, HttpCode, HttpStatus } from '@nestjs/common';
import { ValidatorPipe } from 'src/pipes/validator.pipe';
import { InformationUserService } from './inforUser.service';
import { InformationUserEntity } from './inforUser.entity';
import { InformationUserDto } from './infor-user-dto/inforUser.dto';
import { CreateInformationUserDto } from './infor-user-dto/create-inforUser.dto';
import { UpdateInformationUserDto } from './infor-user-dto/update-inforUser.dto';

// working with DTO
@Controller('infor-user') 
export class InformationUserController  {
    constructor(private informationUserService: InformationUserService){}

    @Get('InformationUsers')
    async getInformationUsers(): Promise<InformationUserDto[]> {
        return  await this.informationUserService.getInformationUsers();
    }
    
    @Get(':id')
    async getInformationUserById(@Param('id') id: number): Promise<InformationUserDto> {
        return await this.informationUserService.getInformationUserById(id);
    }

    @Post('create')
    @UsePipes(new ValidatorPipe())
    async createInformationUser(@Body() informationDto: CreateInformationUserDto){
        return await this.informationUserService.createInformationUser(informationDto);
    }

    @Put('update/:id')
    async updateInformationUserById(@Param('id') id: number, 
    @Body() informationDto: UpdateInformationUserDto): Promise<InformationUserDto> {
        return await this.informationUserService.updateInformationUserById(id, informationDto);
    }

    @Delete('delete/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteInformationUserById(@Param('id') id: number): Promise<void> {
        console.log(this.informationUserService.deleteInformationUserById(id));
    }
}
