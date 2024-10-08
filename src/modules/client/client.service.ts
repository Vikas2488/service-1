import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@prisma/client';
import { CreateClientDto } from './dto/create-client.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { type ExtendedPrismaClient } from 'prisma.extension';
import { ConfigService } from '@nestjs/config';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly configService: ConfigService,
  ) {}

  async getClientByAccountId(accountId: string): Promise<Client | null> {
    return this.prismaService.client.client.findUniqueOrThrow({
      where: {
        accountId: accountId,
      },
      include: {
        phoneConfigs: {
          include: {
            faqs: true,
            phoneNumber: true,
          },
        },
        subscription: true,
      },
    });
  }

  async createClient(clientData: CreateClientDto) {
    if (clientData.phoneNumberId)
      await this.prismaService.client.phoneNumber.update({
        where: {
          id: clientData.phoneNumberId,
        },
        data: {
          available: false,
        },
      });

    const newClient = await this.prismaService.client.client.create({
      data: {
        accountId: clientData.accountId,
        clientName: clientData.clientName,
        clientWebsite: clientData.website,
        state: clientData.state,
        postalCode: clientData.postalCode,
        streetAddress: clientData.streetAddress,
        industry: clientData.industry,
        referralSource: clientData.referralSource,
        businessPhoneNumber: clientData.businessPhoneNumber,
        googleMyBusinessLink: clientData.googleMyBusinessLink,
        phoneConfigs: {
          ...(clientData.phoneNumberId
            ? {
                create: {
                  isActive: true,
                  pricingPageLink: clientData.pricingPageLink,
                  phoneNumber: clientData.phoneNumberId
                    ? { connect: { id: clientData.phoneNumberId } }
                    : {},
                  greetingMessage: clientData.greetingMessage,
                  voice: {
                    connect: {
                      id: clientData.voiceId,
                    },
                  },
                },
              }
            : {}),
        },
        subscription: {
          create: {
            subscriptionStartTime: new Date(),
            callsRemaining: 5,
          },
        },
      },
    });

    const newClientBusiness =
      await this.prismaService.client.clientBusiness.create({
        data: {
          client: {
            connect: {
              id: newClient.id,
            },
          },
        },
      });

    // if (clientData.website) {
    //   const t = await fetch(
    //     `${this.configService.get(
    //       'app.websiteDataParsingBackendBaseUrl',
    //     )}/api/business/website/parse`,
    //     {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         client_business_id: newClientBusiness.id,
    //         website_link: clientData.website,
    //       }),
    //     },
    //   );
    //   console.log({ t: await t.json() });
    // }

    return newClient;
  }

  async updateClient(clientId: string, clientData: UpdateClientDto) {
    await this.prismaService.client.client.update({
      data: { ...clientData },
      where: { id: clientId },
    });
  }
}
