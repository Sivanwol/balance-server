import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, ConfigurationClientSide } from './models/configuration.model';
import { PrismaService } from '@balancer/share-server-common/lib/services/prisma.service';
@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService, @Inject(CACHE_MANAGER) private cacheManager: Cache, private prismaService: PrismaService) {}
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
