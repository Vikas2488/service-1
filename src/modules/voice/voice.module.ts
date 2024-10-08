import { Module } from '@nestjs/common';

import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';

@Module({
  imports: [],
  controllers: [VoiceController],
  providers: [VoiceService],
})
export class VoiceModule {}
