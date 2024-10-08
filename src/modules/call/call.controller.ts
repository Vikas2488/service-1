import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { Prisma, Call } from '@prisma/client';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { CallService } from './call.service';
import { AddCallDto } from './dto/add-call.dto';
import { OrderByPipe, WherePipe } from 'src/pipes/prisma-pipes';
import { QueryRequired } from 'src/decorators/query-required';

@Controller('calls')
@ApiBearerAuth('authorization')
export class CallController {
  constructor(private readonly callService: CallService) {}
  @ApiQuery({
    name: 'clientId',
    description: 'Client ID',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'where',
    description: 'Query conditions',
    required: false,
    type: Object,
  })
  @ApiQuery({
    name: 'orderBy',
    description: 'Order by field',
    required: false,
    type: Object,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    type: Number,
  })
  @Get()
  async findAllCallsByClientId(
    @QueryRequired('clientId') clientId: string,
    @Query('where', WherePipe)
    where?: Prisma.CallWhereInput,
    @Query('orderBy', OrderByPipe)
    orderBy?: Prisma.CallOrderByWithRelationInput,
    @Query(
      'page',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
        optional: true,
      }),
    )
    page?: number,
    @Query(
      'limit',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
        optional: true,
      }),
    )
    limit?: number,
  ) {
    try {
      const { clientId: id, ...whereWithoutClientId } = where || {};
      return await this.callService.findAllCallsByClientId(
        clientId,
        whereWithoutClientId,
        orderBy,
        page,
        limit,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error finding calls',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add')
  async addCall(@Body() addCallDto: AddCallDto): Promise<Call> {
    try {
      return await this.callService.addCall(
        addCallDto.aiNumber,
        addCallDto.callId,
        addCallDto.messages,
      );
    } catch (error) {
      throw new HttpException(
        'Error adding call',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
