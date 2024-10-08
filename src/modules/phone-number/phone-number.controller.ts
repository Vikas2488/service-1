import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { PhoneNumberService } from './phone-number.service';

@Controller('phone-numbers')
@ApiBearerAuth('authorization')
export class PhoneNumberController {
  constructor(private readonly phoneNumberService: PhoneNumberService) {}

  @Get()
  async getAllPhoneNumbers() {
    try {
      return await this.phoneNumberService.getAllPhoneNumbers();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error getting phone numbers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
