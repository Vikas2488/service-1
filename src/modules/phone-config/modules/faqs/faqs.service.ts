import { Inject, Injectable } from '@nestjs/common';
import { Faqs } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

import { type ExtendedPrismaClient } from 'prisma.extension';

@Injectable()
export class FaqsService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  getAllFaqsByPhoneConfigId(
    phoneConfigId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.prismaService.client.faqs
      .paginate({
        where: {
          phoneConfigId: phoneConfigId,
        },
        select: {
          id: true,
          question: true,
          answer: true,
        },
      })
      .withPages({
        limit,
        page,
        includePageCount: true,
      });
  }

  async addFaqs(
    phoneConfigId: string,
    faqs: { question: string; answer: string }[],
  ) {
    return this.prismaService.client.faqs.createMany({
      data: faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
        phoneConfigId,
      })),
    });
  }

  deleteFaq(id: string): Promise<Faqs> {
    return this.prismaService.client.faqs.delete({
      where: {
        id: id,
      },
    });
  }

  updateFaq(id: string, question: string, answer: string): Promise<Faqs> {
    return this.prismaService.client.faqs.update({
      where: {
        id: id,
      },
      data: {
        question: question,
        answer: answer,
      },
    });
  }
}
