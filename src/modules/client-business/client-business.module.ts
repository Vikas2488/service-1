import { Module } from '@nestjs/common';
import { ClientBusinessController } from './client-business.controller';
import { ClientBusinessService } from './client-business.service';

@Module({
  imports: [],
  controllers: [ClientBusinessController],
  providers: [ClientBusinessService],
})
export class ClientBusinessModule {}
