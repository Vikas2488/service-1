import { IsNotEmpty, IsString } from 'class-validator';
import { Message } from '../call.types';

export class AddCallDto {
  @IsString()
  @IsNotEmpty()
  readonly callId: string;
  @IsString()
  @IsNotEmpty()
  readonly aiNumber: string;
  @IsNotEmpty()
  readonly messages: Message[];
}
