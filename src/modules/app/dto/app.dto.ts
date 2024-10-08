import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClientRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly message: string;
}

export class MailCampaignDto {
  @IsString()
  @IsNotEmpty()
  readonly campaignId: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;
}
