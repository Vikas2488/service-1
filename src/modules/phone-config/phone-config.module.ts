import { Module } from '@nestjs/common';
import { PhoneConfigController } from './phone-config.controller';
import { PhoneConfigService } from './phone-config.service';
import { FaqsModule } from './modules/faqs/faqs.module';

@Module({
  imports: [FaqsModule],
  controllers: [PhoneConfigController],
  providers: [PhoneConfigService],
})
export class PhoneConfigModule {}
