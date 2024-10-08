import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { PhoneConfig } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { PhoneConfigService } from './phone-config.service';
import { QueryRequired } from 'src/decorators/query-required';
import { UpdatePhoneConfigDto } from './dto/update-phone-config.dto';

@Controller('phone-config')
@ApiBearerAuth('authorization')
export class PhoneConfigController {
  constructor(private readonly PhoneConfigService: PhoneConfigService) {}

  @Get()
  async getPhoneConfigsByClientId(
    @QueryRequired('clientId') clientId: string,
  ): Promise<PhoneConfig[]> {
    try {
      return await this.PhoneConfigService.getPhoneConfigsByClientId(clientId);
    } catch (error) {
      throw new HttpException(
        'Error getting client config',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:number')
  async getPhoneConfigByNumber(@Param('number') number: string) {
    try {
      return await this.PhoneConfigService.getPhoneConfigByNumber(number);
    } catch (error) {
      throw new HttpException(
        'Error getting client config',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('update')
  async updatePhoneConfig(
    @Body() updatePhoneConfigDto: UpdatePhoneConfigDto,
  ): Promise<PhoneConfig> {
    const { phoneConfigId, ...config } = updatePhoneConfigDto;
    try {
      const updatedConfig = await this.PhoneConfigService.updatePhoneConfig(
        phoneConfigId,
        config,
      );
      if (!updatedConfig) {
        throw new HttpException('No content', HttpStatus.NO_CONTENT);
      }
      return updatedConfig;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error updating client config',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
