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

  public async GetServiceSettings(clientFilter?: { isSecure: boolean }, forceReload?: boolean): Promise<PlatformSettings[]> {
    if (this.configData.length === 0 || forceReload) await this.reloadServiceSettings();

    if (clientFilter) {
      return this.configData.filter((config) => config.isClientSecure === clientFilter.isSecure);
    }
    return this.configData;
  }

  public async GetServiceSettingsByKey(key: string, clientFilter?: { isSecure: boolean }, forceReload?: boolean): Promise<PlatformSettings> {
    if (this.configData.length === 0 || forceReload) await this.reloadServiceSettings();
    if (clientFilter) {
      if (this.configData[key].isClientSecure === clientFilter.isSecure) {
        return this.configData[key];
      }
      return null;
    }
    return this.configData[key];
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

  public async SetServiceSettings(payload: ConfigurationMessage[]) {
    if (payload.length > 0) {
      const services = [];
      for (let index = 0; index < payload.length; index++) {
        const config = payload[index];
        const { service } = config;
        services.push(service);
      }
      for (let index = 0; index < services.length; index++) {
        const service = services[index];
        const cacheKey = CacheKeys.ServiceSettings(service);
        const status = await DbService.getInstance().HasCache(cacheKey);
        if (status) await DbService.getInstance().RemoveCache(cacheKey);
        await DbService.getInstance().CacheResult<Configuration>(cacheKey, { items: payload.filter((item) => item.service === service) });
      }
    }
  }
}
