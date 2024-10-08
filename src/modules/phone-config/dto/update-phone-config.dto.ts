export class UpdatePhoneConfigDto {
  phoneConfigId: string;
  isActive?: boolean;
  pricePageLink?: string;
  greetingMessage?: string;
  voiceId?: string;
  callForwardingNumber?: string;
  blockScamAndSalesCalls?: boolean;
}
