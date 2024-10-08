import { Inject, Injectable } from '@nestjs/common';
import { PhoneConfig } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

import { type ExtendedPrismaClient } from 'prisma.extension';

@Injectable()
export class PhoneConfigService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  getPhoneConfigsByClientId(clientId: string): Promise<PhoneConfig[]> {
    return this.prismaService.client.phoneConfig.findMany({
      where: {
        clientId: clientId,
      },
      include: {
        faqs: true,
      },
    });
  }

  updatePhoneConfig(
    phoneConfigId: string,
    config: Omit<Partial<PhoneConfig>, 'id' | 'clientId'>,
  ): Promise<PhoneConfig> {
    return this.prismaService.client.phoneConfig.update({
      where: {
        id: phoneConfigId,
      },
      data: {
        ...config,
      },
    });
  }

  getPhoneConfigByNumber(number: string) {
    return this.prismaService.client.phoneConfig.findFirstOrThrow({
      where: {
        phoneNumber: {
          number: number,
        },
      },
      select: {
        phoneNumber: true,
        voice: true,
        greetingMessage: true,
        llm: true,
        prompt: true,
        faqs: true,
      },
    });
  }
}
