import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CustomPrismaService } from 'nestjs-prisma';

import { type ExtendedPrismaClient } from 'prisma.extension';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  @Cron('0 0 * * *')
  async releasePhoneNumberFromSubscription() {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    try {
      await this.prismaService.client.subscription.updateMany({
        where: {
          status: 'active',
          subscriptionStartTime: {
            lte: threeDaysAgo,
          },
        },
        data: {
          status: 'inactive',
        },
      });
      //TODO: redesign phoneConfig
      await this.prismaService.client.phoneNumber.updateMany({
        where: {
          phoneConfigs: {
            some: {
              client: {
                subscription: {
                  status: 'inactive',
                },
              },
            },
          },
        },
        data: {
          available: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getSubscription(calledTo: string) {
    const phoneConfig =
      await this.prismaService.client.phoneConfig.findFirstOrThrow({
        where: {
          phoneNumber: {
            number: calledTo,
          },
        },
      });

    return await this.prismaService.client.subscription.findUniqueOrThrow({
      where: {
        clientId: phoneConfig.clientId,
      },
    });
  }

  async updateSubscription(calledTo: string, callsRemaining: number) {
    const phoneConfig =
      await this.prismaService.client.phoneConfig.findFirstOrThrow({
        where: {
          phoneNumber: {
            number: calledTo,
          },
        },
      });
    if (callsRemaining <= 0) {
      await this.prismaService.client.phoneNumber.update({
        where: {
          id: phoneConfig.phoneNumberId,
        },
        data: {
          available: true,
        },
      });
    }
    return await this.prismaService.client.subscription.update({
      where: {
        clientId: phoneConfig.clientId,
      },
      data: {
        callsRemaining: callsRemaining,
        status: callsRemaining <= 0 ? 'inactive' : 'active',
      },
    });
  }
}
