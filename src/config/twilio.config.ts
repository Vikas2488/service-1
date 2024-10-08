import { registerAs } from '@nestjs/config';

export default registerAs('twilio', () => ({
  twilioAccountId: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
}));
