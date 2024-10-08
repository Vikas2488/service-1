import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  HttpException,
  HttpStatus,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { Faqs } from '@prisma/client';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { FaqsService } from './faqs.service';
import { QueryRequired } from 'src/decorators/query-required';
import { AddFaqDto } from './dto/add-faqs.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Controller('faqs')
@ApiBearerAuth('authorization')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}
  @ApiQuery({ name: 'phoneConfigId', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  async getAllFaqsByClientId(
    @QueryRequired('phoneConfigId') phoneConfigId: string,
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
      return await this.faqsService.getAllFaqsByPhoneConfigId(
        phoneConfigId,
        page,
        limit,
      );
    } catch (error) {
      throw new HttpException(
        'Error getting FAQs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add')
  async addFaq(@Body() addFaqDto: AddFaqDto) {
    try {
      return await this.faqsService.addFaqs(
        addFaqDto.phoneConfigId,
        addFaqDto.faqs,
      );
    } catch (error) {
      throw new HttpException(
        'Error adding FAQs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete')
  async deleteFaq(@QueryRequired('id') id: string): Promise<Faqs> {
    try {
      const deletedFaq = await this.faqsService.deleteFaq(id);
      if (!deletedFaq) {
        throw new HttpException('No content', HttpStatus.NO_CONTENT);
      }
      return deletedFaq;
    } catch (error) {
      throw new HttpException(
        'Error deleting FAQ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('update')
  async updateFaq(@Body() updateFaqDto: UpdateFaqDto): Promise<Faqs> {
    try {
      const updatedFaq = await this.faqsService.updateFaq(
        updateFaqDto.faqId,
        updateFaqDto.question,
        updateFaqDto.answer,
      );
      if (!updatedFaq) {
        throw new HttpException('No content', HttpStatus.NO_CONTENT);
      }
      return updatedFaq;
    } catch (error) {
      throw new HttpException(
        'Error updating FAQ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
