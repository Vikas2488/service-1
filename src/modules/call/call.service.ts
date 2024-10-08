import { Injectable, Inject } from '@nestjs/common';
import { Prisma, Call } from '@prisma/client';
import { TwilioService } from 'nestjs-twilio';
import { CustomPrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'bson';

import { type ExtendedPrismaClient } from 'prisma.extension';
import { Message } from './call.types';

@Injectable()
export class CallService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  /**
   * @desc Find all calls with pagination
   * @param where
   * @param orderBy
   */
  findAllCallsByClientId(
    clientId: string,
    where: Prisma.CallWhereInput,
    orderBy: Prisma.CallOrderByWithRelationInput,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.prismaService.client.call
      .paginate({
        where: {
          ...where,
          clientId,
        },
        orderBy: orderBy ? orderBy : { startTime: 'desc' },
        select: {
          id: true,
          startTime: true,
          status: true,
          duration: true,
          updatedAt: true,
          recordingLink: true,
          conversationData: true,
        },
      })
      .withPages({
        page,
        limit,
        includePageCount: true,
      });
  }

  private async getRecordingLink(callSid: string) {
    try {
      const accountSid =
        this.configService.getOrThrow<string>('TWILIO_ACCOUNT_SID');
      const recordings = await this.twilioService.client
        .calls(callSid)
        .recordings.list();
      if (recordings.length > 0) {
        const recordingSid = recordings[0].sid;
        return `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${recordingSid}.wav`;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addCall(
    aiNumber: string,
    callId: string,
    messages: Message[],
  ): Promise<Call> {
    if (!aiNumber) throw new Error('aiNumber is required');
    const phoneConfig =
      await this.prismaService.client.phoneConfig.findFirstOrThrow({
        where: {
          phoneNumber: {
            number: aiNumber,
          },
        },
      });

    console.log('aiNumber', aiNumber);

    const callData = await this.twilioService.client.calls(callId).fetch();

    const recordingLink = await this.getRecordingLink(callId);

    return this.prismaService.client.call.create({
      data: {
        startTime: callData.startTime,
        endTime: callData.endTime,
        status: callData.status,
        duration: Number(callData.duration),
        callId: callData.sid,
        conversationData: messages.map((message) => ({
          role: message.role,
          content: message.content,
          timeAdded: message.timeAdded,
          id: new ObjectId().toString(),
        })),
        client: {
          connect: {
            id: phoneConfig.clientId,
          },
        },
        ...(recordingLink && { recordingLink }),
      },
    });
  }
}
