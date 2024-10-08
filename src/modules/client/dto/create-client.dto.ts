export class CreateClientDto {
  readonly accountId: string;
  readonly website?: string;
  readonly clientName: string;
  readonly streetAddress: string;
  readonly state: string;
  readonly postalCode: string;
  readonly businessPhoneNumber?: string;
  readonly industry?: string;
  readonly googleMyBusinessLink?: string;
  readonly pricingPageLink?: string;
  readonly phoneNumberId?: string;
  readonly greetingMessage?: string;
  readonly referralSource?: string;
  readonly voiceId: string;
}
