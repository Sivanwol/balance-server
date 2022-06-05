import { PlatformServices } from './../../../../node_modules/.pnpm/@prisma+client@3.14.0/node_modules/.prisma/client/index.d';
import { Service } from 'typedi';
import { PlatformSettings } from '@prisma/client';
import { logger } from '../utils/logger';
import { DbService } from './db.service';
import { CacheKeys } from '../constraints/CacheKeys';
import { Configuration, ConfigurationMessage } from '../interfaces/IConfiguration';

@Service()
export class ConfigService {
  private configData: PlatformSettings[] = [];

  public async GetServiceSettings(service: PlatformServices ,clientFilter?: { isSecure: boolean }, forceReload?: boolean): Promise<PlatformSettings[]> {
    if (this.configData.length === 0 || forceReload) await this.reloadServiceSettings(service);

    if (clientFilter) {
      return this.configData.filter((config) => config.isClientSide&&config.isClientSecure === clientFilter.isSecure);
    }
    return this.configData;
  }

  public async GetServiceSettingsByKey(service: PlatformServices ,key: string, clientFilter?: { isSecure: boolean }, forceReload?: boolean): Promise<PlatformSettings> {
    if (this.configData.length === 0 || forceReload) await this.reloadServiceSettings(service);
    if (clientFilter) {
      if (this.configData[key].isClientSecure === clientFilter.isSecure && this.configData[key].service === service) {
        return this.configData[key];
      }
      return null;
    }
    return this.configData[key].filter(c => c.service === service);
  }

  private async reloadServiceSettings(service: PlatformServices) {
    logger.info(`received service: ${service} request => GetServiceSettings`);
    let globalConfig: PlatformSettings[] = [];
    let serviceConfig;
    let status = await DbService.getInstance().HasCache(CacheKeys.ServiceSettings(service));
    if (status) globalConfig = (await DbService.getInstance().GetCacheQuery(CacheKeys.ServiceSettings(service))) as PlatformSettings[];
    status = await DbService.getInstance().HasCache(CacheKeys.ServiceSettings(process.env.MICROSERVICE_Group));
    if (status) {
      serviceConfig = (await DbService.getInstance().GetCacheQuery(CacheKeys.ServiceSettings(process.env.MICROSERVICE_Group))) as PlatformSettings[];
    }
    if (globalConfig && serviceConfig) {
      console.log(`service: ${service} config`, [...globalConfig, ...serviceConfig]);
      this.configData = [...globalConfig, ...serviceConfig];
    }
  }

  public async SetServiceSettings(service: PlatformServices ,payload: ConfigurationMessage[]) {
    if (payload.length > 0) {
      const cacheKey = CacheKeys.ServiceSettings(service);
      const status = await DbService.getInstance().HasCache(cacheKey);
      if (status) await DbService.getInstance().RemoveCache(cacheKey);
      await DbService.getInstance().CacheResult<Configuration>(cacheKey, { items: payload.filter((item) => item.service === service) });
    }
  }
}
