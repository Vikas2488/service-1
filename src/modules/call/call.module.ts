import { Module } from '@nestjs/common';

import { CallService } from './call.service';
import { CallController } from './call.controller';

@Module({
  imports: [],
  controllers: [CallController],
  providers: [CallService],
})
export class CallModule {}
