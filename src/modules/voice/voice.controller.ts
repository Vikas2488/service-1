import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { VoiceService } from './voice.service';

@Controller('voices')
@ApiBearerAuth('authorization')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Get()
  async getAllVoices() {
    try {
      return await this.voiceService.getAllVoices();
    } catch (error) {
      throw new HttpException(
        'Error getting voices',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
