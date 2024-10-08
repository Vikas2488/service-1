import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

import { type ExtendedPrismaClient } from 'prisma.extension';

@Injectable()
export class VoiceService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  getAllVoices() {
    return this.prismaService.client.voice
      .paginate({
        select: {
          id: true,
          name: true,
          updatedAt: true,
          sampleLink: true,
        },
      })
      .withPages({
        page: 1,
        limit: 20,
      });
  }
}
