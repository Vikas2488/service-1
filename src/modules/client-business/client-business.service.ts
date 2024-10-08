import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

import { type ExtendedPrismaClient } from 'prisma.extension';

@Injectable()
export class ClientBusinessService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  async updateStatus(clientBusinessId: string, status: string) {
    return await this.prismaService.client.clientBusiness.update({
      where: {
        id: clientBusinessId,
      },
      data: {
        status: status,
      },
    });
  }

  async updateWebsiteData(clientBusinessId: string, data: any) {
    return await this.prismaService.client.clientBusiness.update({
      where: {
        id: clientBusinessId,
      },
      data: {
        websiteData: data,
      },
    });
  }
}
