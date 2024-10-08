import { registerAs } from '@nestjs/config';

export default registerAs('clerk', () => ({
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
}));
