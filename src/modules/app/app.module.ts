import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomPrismaModule } from 'nestjs-prisma';

import appConfig from 'src/config/app.config';
import clerkConfig from 'src/config/clerk.config';
import twilioConfig from 'src/config/twilio.config';

import HealthModule from '../health/health.module';
import { CallModule } from '../call/call.module';

import { TwilioModule } from 'nestjs-twilio';
import { AppController } from './app.controller';
import { ClientModule } from '../client/client.module';
import { VoiceModule } from '../voice/voice.module';
import { PhoneNumberModule } from '../phone-number/phone-number.module';
import { PhoneConfigModule } from '../phone-config/phone-config.module';
import { extendedPrismaClient } from 'prisma.extension';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { ClientBusinessModule } from '../client-business/client-business.module';
import { AppLoggerMiddleware } from 'src/middlewares/app-logger.middleware';
import { SubscriptionModule } from '../subscription/subscription.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, clerkConfig, twilioConfig],
    }),
    ScheduleModule.forRoot(),
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: 'PrismaService',

      useFactory: () => {
        return extendedPrismaClient;
      },
    }),
    TwilioModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        accountSid: cfg.getOrThrow('TWILIO_ACCOUNT_SID'),
        authToken: cfg.getOrThrow('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    CallModule,
    ClientModule,
    VoiceModule,
    PhoneNumberModule,
    PhoneConfigModule,
    ClientBusinessModule,
    SubscriptionModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
