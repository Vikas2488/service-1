import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { Client } from '@prisma/client';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { QueryRequired } from 'src/decorators/query-required';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
@ApiBearerAuth('authorization')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiQuery({ name: 'accountId', description: 'Account ID', required: true })
  @Get()
  async getClientByAccountId(
    @QueryRequired('accountId') accountId: string,
  ): Promise<Client | null> {
    try {
      return await this.clientService.getClientByAccountId(accountId);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error getting client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  async createClient(@Body() createClientDto: CreateClientDto) {
    try {
      return await this.clientService.createClient(createClientDto);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error creating client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('update/:clientId')
  async updateClient(
    @Param('clientId') clientId: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    try {
      return await this.clientService.updateClient(clientId, updateClientDto);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error updating client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
