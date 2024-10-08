import { Module } from '@nestjs/common';

import { PhoneNumberService } from './phone-number.service';
import { PhoneNumberController } from './phone-number.controller';

@Module({
  imports: [],
  controllers: [PhoneNumberController],
  providers: [PhoneNumberService],
})
export class PhoneNumberModule {}
