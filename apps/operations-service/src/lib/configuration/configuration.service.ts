import { PrismaService } from '@applib/share-server-common'
import { Injectable } from '@nestjs/common';
import { Configuration, ConfigurationClientSide } from './models/configuration.model';
@Injectable()
export class ConfigurationService {
  constructor(private prismaService: PrismaService) {}
  public async fetchClientSideConfigurations(): Promise<ConfigurationClientSide[]> {
    return (
      await this.prismaService.platformSettings.findMany({
        where: {
          isClientSide: true,
          isEnabled: true,
        },
      })
    ).map((item) => ({ key: item.key, value: item.value })) as ConfigurationClientSide[];
  }
  public async fetchConfigurations(): Promise<Configuration[]> {
    return (await this.prismaService.platformSettings.findMany()).map((item) => ({
      key: item.key,
      value: item.value,
      service: item.service,
      isClientSide: item.isClientSide,
      isEnabled: item.isEnabled,
    })) as Configuration[];
  }
}
