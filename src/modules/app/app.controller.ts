import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { type ExtendedPrismaClient } from 'prisma.extension';
import { QueryRequired } from 'src/decorators/query-required';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TwilioService } from 'nestjs-twilio';
import { CreateClientRequestDto, MailCampaignDto } from './dto/app.dto';

interface CallsByTimeOfDay {
  morning: number;
  afternoon: number;
  evening: number;
}

@Controller()
@ApiBearerAuth('authorization')
export class AppController {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly twilioService: TwilioService,
  ) {}

  private async getMonthRangeDates(): Promise<[Date, Date]> {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    return [firstDayOfMonth, lastDayOfMonth];
  }

  private async getTotalDurationSecsThisMonth(
    clientId: string,
  ): Promise<number> {
    const [firstDayOfMonth, lastDayOfMonth] = await this.getMonthRangeDates();

    const result = await this.prismaService.client.call.aggregate({
      _sum: { duration: true },
      where: {
        clientId,
        startTime: { gte: firstDayOfMonth, lte: lastDayOfMonth },
      },
    });

    return result._sum.duration || 0;
  }

  private async getTotalCallsThisMonth(clientId: string): Promise<number> {
    const [firstDayOfMonth, lastDayOfMonth] = await this.getMonthRangeDates();

    const result = await this.prismaService.client.call.aggregate({
      _count: { id: true },
      where: {
        clientId,
        startTime: { gte: firstDayOfMonth, lte: lastDayOfMonth },
      },
    });

    return result._count.id || 0;
  }

  private async getCallsByTimeOfDayLast7Days(
    clientId: string,
  ): Promise<CallsByTimeOfDay> {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const callsLast7Days = await this.prismaService.client.call.findMany({
      where: { clientId, startTime: { gte: sevenDaysAgo, lte: currentDate } },
      select: { id: true, startTime: true },
    });

    const callsByTimeOfDay: CallsByTimeOfDay = {
      morning: 0,
      afternoon: 0,
      evening: 0,
    };

    callsLast7Days.forEach((call) => {
      const startHour = call.startTime.getHours();

      if (startHour >= 5 && startHour < 12) {
        callsByTimeOfDay.morning += 1;
      } else if (startHour >= 12 && startHour < 17) {
        callsByTimeOfDay.afternoon += 1;
      } else {
        callsByTimeOfDay.evening += 1;
      }
    });

    return callsByTimeOfDay;
  }

  private isAfterWorkHours(countryCode: string, date: string): boolean {
    const startWorkingHour = 9;
    const endWorkingHour = 17;
    const currentDate = new Date(date);
    let timezoneOffset = 0;

    switch (countryCode) {
      case 'US':
        timezoneOffset = -5; // Eastern Standard Time (EST)
        break;
      case 'IN':
        timezoneOffset = 5.5; // India Standard Time (IST)
        break;
      case 'AU':
        timezoneOffset = 11; // Australian Eastern Standard Time (AEST)
        break;
      default:
        timezoneOffset = 11; // Default to Australian Eastern Standard Time (AEST)
    }

    currentDate.setHours(currentDate.getHours() + timezoneOffset);

    return (
      currentDate.getHours() < startWorkingHour ||
      currentDate.getHours() >= endWorkingHour
    );
  }

  private async getTotalCallsAfterWorkingHours(
    clientId: string,
  ): Promise<number> {
    const clientInfo = await this.prismaService.client.client.findUniqueOrThrow(
      {
        where: { id: clientId },
        include: { phoneConfigs: { include: { phoneNumber: true } } },
      },
    );
    const currentDate = new Date();
    const last7Days = new Date(currentDate);
    last7Days.setDate(currentDate.getDate() - 7);

    const callsLast7Days = await this.prismaService.client.call.findMany({
      where: { startTime: { gte: last7Days, lt: currentDate }, clientId },
      select: { startTime: true },
    });

    return callsLast7Days.filter((call) =>
      this.isAfterWorkHours(
        clientInfo.phoneConfigs[0].phoneNumber.country,
        call.startTime.toString(),
      ),
    ).length;
  }

  private async getTotalMetrics(clientId: string): Promise<any> {
    const [
      totalDurationSecs,
      totalCalls,
      callsByTimeOfDay,
      totalCallsAfterWorkingHours,
    ] = await Promise.all([
      this.getTotalDurationSecsThisMonth(clientId),
      this.getTotalCallsThisMonth(clientId),
      this.getCallsByTimeOfDayLast7Days(clientId),
      this.getTotalCallsAfterWorkingHours(clientId),
    ]);

    return {
      thisMonthTotalSecs: totalDurationSecs,
      thisMonthTotalCalls: totalCalls,
      thisMonthAdditionalMinutesUsed: 0,
      thisWeekTotalCallsByTimeOfDay: callsByTimeOfDay,
      thisWeekHoursSaved: 0,
      thisWeekAfterHoursCallAnswered: totalCallsAfterWorkingHours,
      thisWeekAppointmentsScheduled: 0,
    };
  }

  @Get('overview')
  @ApiQuery({ name: 'clientId', type: 'string', required: true })
  async getOverviewData(
    @QueryRequired('clientId') clientId: string,
  ): Promise<any> {
    return this.getTotalMetrics(clientId);
  }

  @Patch('mail-campaign')
  async updatePhoneNumberInMailCampaign(@Body() mailCampaign: MailCampaignDto) {
    try {
      const campaign = await this.prismaService.client.campaign.update({
        where: { id: mailCampaign.campaignId },
        data: { phoneNumber: mailCampaign.phoneNumber },
      });

      const phoneConfig =
        await this.prismaService.client.phoneConfig.findFirstOrThrow({
          where: {
            clientId: campaign.campaignClientId,
          },
          orderBy: {
            updatedAt: 'asc',
          },
          include: {
            phoneNumber: true,
          },
        });

      await this.prismaService.client.phoneConfig.update({
        where: {
          id: phoneConfig.id,
        },
        data: {
          prompt: campaign.prompt,
          greetingMessage: campaign.greetingMessage,
        },
      });

      await this.twilioService.client.calls.create({
        url: 'https://api.voiceapp.zekyaa.com/api/call',
        method: 'GET',
        record: true,
        to: campaign.phoneNumber,
        from: phoneConfig.phoneNumber.number,
      });

      return { message: 'Phone number updated successfully' }; // Return success message
    } catch (error) {
      console.error(error);

      throw new HttpException(
        'Error updating phone number to config',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('mail-campaign')
  async getMailCampaignById(@QueryRequired('campaignId') campaignId: string) {
    try {
      const mailCampaign =
        await this.prismaService.client.campaign.findUniqueOrThrow({
          select: {
            id: true,
            businessName: true,
          },
          where: {
            id: campaignId,
          },
        });
      return mailCampaign;
    } catch (error) {
      throw new HttpException('Mail campaign not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('client-request/:clientId')
  async createClientRequest(
    @Param('clientId') clientId: string,
    @Body() createClientRequestDto: CreateClientRequestDto,
  ) {
    try {
      const clientRequest =
        await this.prismaService.client.clientRequest.create({
          data: {
            ...createClientRequestDto,
            clientId,
          },
        });
      return clientRequest;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error creating client request', 500);
    }
  }
}
