import {
  Controller,
  HttpException,
  HttpStatus,
  Patch,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ClientBusinessService } from './client-business.service';
import { QueryRequired } from 'src/decorators/query-required';
import { UpdateGmbDataDto } from './dto/update-gmb-data.dto';

@Controller('client-business')
@ApiBearerAuth('authorization')
export class ClientBusinessController {
  constructor(private readonly clientBusinessService: ClientBusinessService) {}

  @ApiQuery({
    name: 'clientBusinessId',
    description: 'Client Business ID',
    required: true,
  })
  @ApiQuery({
    name: 'status',
    description: 'Status',
    required: true,
  })
  @Patch('update-status')
  async updateStatus(
    @QueryRequired('clientBusinessId') clientBusinessId: string,
    @QueryRequired('status') status: string,
  ) {
    try {
      return await this.clientBusinessService.updateStatus(
        clientBusinessId,
        status,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error updating status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('update-website-data')
  async updateWebsiteData(@Body() updateGmbDataDto: UpdateGmbDataDto) {
    try {
      return await this.clientBusinessService.updateWebsiteData(
        updateGmbDataDto.clientBusinessId,
        updateGmbDataDto.data,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error updating gmb data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
