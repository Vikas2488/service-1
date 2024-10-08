import { Controller, Get, HttpException, Patch, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { QueryRequired } from 'src/decorators/query-required';
import { SubscriptionService } from './subscription.service';
import { UpdateSubscriptionDataDto } from './dto/update-subscription-data.dto';

@Controller('subscription')
@ApiBearerAuth('authorization')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiQuery({
    name: 'calledTo',
    description: 'Client Phone Number',
    required: true,
    type: String,
  })
  @Get()
  async getSubscription(@QueryRequired('calledTo') phoneNumber: string) {
    try {
      return await this.subscriptionService.getSubscription(phoneNumber);
    } catch (error) {
      console.log(error);
      throw new HttpException('Error getting subscription', 500);
    }
  }

  @Patch('update')
  async updateSubscription(
    @Body() updateSubscriptionDto: UpdateSubscriptionDataDto,
  ) {
    try {
      return await this.subscriptionService.updateSubscription(
        updateSubscriptionDto.calledTo,
        updateSubscriptionDto.callsRemaining,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException('Error updating subscription', 500);
    }
  }
}
