import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InformationUserService } from './infor-user.service';
import { InformationUserDto } from './dtos/infor-user.dto';
import { CreateInformationUserDto } from './dtos/create-infor-user.dto';
import { UpdateInformationUserDto } from './dtos/update-infor-user.dto';
import { ValidatorPipe } from 'src/pipes/validator.pipe';

// working with DTO
@Controller('infor-user')
export class InformationUserController {
  constructor(
    private readonly informationUserService: InformationUserService,
  ) {}

  @Get('InformationUsers')
  async getInformationUsers(): Promise<InformationUserDto[]> {
    return await this.informationUserService.getInformationUsers();
  }

  @Get(':id')
  async getInformationUserById(
    @Param('id') id: number,
  ): Promise<InformationUserDto> {
    return await this.informationUserService.getInformationUserById(id);
  }

  @Post('create')
  @UsePipes(new ValidatorPipe())
  async createInformationUser(
    @Body() informationDto: CreateInformationUserDto,
  ) {
    return await this.informationUserService.createInformationUser(
      informationDto,
    );
  }

  @Put('update/:id')
  async updateInformationUserById(
    @Param('id') id: number,
    @Body() informationDto: UpdateInformationUserDto,
  ): Promise<InformationUserDto> {
    return await this.informationUserService.updateInformationUserById(
      id,
      informationDto,
    );
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInformationUserById(@Param('id') id: number): Promise<void> {
    console.log(this.informationUserService.deleteInformationUserById(id));
  }
}
