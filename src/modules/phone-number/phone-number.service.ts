import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

import { type ExtendedPrismaClient } from 'prisma.extension';

@Injectable()
export class PhoneNumberService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  getAllPhoneNumbers() {
    return this.prismaService.client.phoneNumber
      .paginate({
        where: {
          available: true,
        },
        select: {
          id: true,
          number: true,
          updatedAt: true,
          available: true,
          country: true,
        },
      })
      .withPages({
        page: 1,
        limit: 20,
      });
  }
}
