import { PlatformServices, PlatformSettings } from '@prisma/client';
import { find, isArray } from 'lodash';
import { Service } from 'typedi';
import RedisUtil from '../utils/redisUtil';
import { logger } from '../utils/logger';
import { CacheKeys } from '../constraints/CacheKeys';
import { DbService } from '../services';
import { knownServices } from '../constraints/knownservices';
import moment = require('moment');

@Service()
export class PlatformSettingsService {
  public async TogglePlatformMaintenanceMode() {
    logger.info('toggle Maintenance Mod  from TogglePlatformMaintenanceMode');
    const currentMaintenanceMode = await RedisUtil.get(CacheKeys.MaintenanceMode);
    await RedisUtil.client.set(CacheKeys.MaintenanceMode, currentMaintenanceMode === '1' ? '0' : '1');
  }
  public async GetServicesSettings() {
    logger.info('fetching Data from GetServicesSettings');
    let platformSettings: PlatformSettings[] = [];
    for (const service of Object.keys(PlatformServices)) {
      if (service) {
        const settings = await this.GetSettings(PlatformServices[service]);
        if (settings && isArray(settings)) platformSettings = [...platformSettings, ...settings];
      }
    }
    return platformSettings;
  }

  public async HasSettingKey(service: PlatformServices,keyName: string) {
    logger.info('received service request => HasSettingKey');
    const playformSettings: PlatformSettings = await DbService.getInstance().connection.platformSettings.findFirst({
      where: {
        service,
        key: keyName,
        isEnabled: true,
      },
    });
    return !!playformSettings;
  }

  public async GetSettingKey(service: PlatformServices, keyName: string) {
    logger.info('received service request => GetSettingKey');
    const playformSettings: PlatformSettings = await DbService.getInstance().connection.platformSettings.findFirst({
      where: {
        service,
        key: keyName,
        isEnabled: true,
      },
    });
    return playformSettings;
  }

  public async HasSettingCacheKey(service: PlatformServices, keyName: string) {
    logger.info('received service request => HasGlobalSettingCacheKey');
    const status = await DbService.getInstance().HasCache(CacheKeys.ServiceSettings(service));
    if (status) {
      // we need verify if it on cache
      const playformSettings: PlatformSettings[] = (await DbService.getInstance().GetCacheQuery(CacheKeys.ServiceSettings(service))) as PlatformSettings[];
      const locateSettings = find(playformSettings, {
        service,
        key: keyName,
      });
      if (!locateSettings) {
        return false;
      }
    }
    return true;
  }

  public async UpdateSettingsValue(service: PlatformServices, keyName: string, valueObj: any) {
    logger.info('received service request => UpdateSettingsValue');
    if (await this.HasSettingKey(service,keyName)) {
      await DbService.getInstance().RemoveCache(CacheKeys.ServiceSettings(service));
    }
    const setting = await DbService.getInstance().connection.platformSettings.update({
      where: {
        key: keyName,
      },
      data: { value: valueObj, updatedAt: moment().format() },
    });
    logger.info('re save cache Data for PlatformSettings');
    await DbService.getInstance().CacheResult<PlatformSettings>(CacheKeys.ServiceSettings(service), setting);
    RedisUtil.client.set('require_services_sync', '1');
    return setting;
  }

  public async ToggleSettingStatus(service: PlatformServices,keyName: string) {
    logger.info('received service request => ToggleSettingStatus');

    if (await this.HasSettingKey(service,keyName)) {
      await DbService.getInstance().RemoveCache(CacheKeys.ServiceSettings(service));
    }
    const playformSettings: PlatformSettings = await DbService.getInstance().connection.platformSettings.findFirst({
      where: {
        key: keyName,
      },
    });
    const status = !playformSettings.isEnabled;
    const setting = await DbService.getInstance().connection.platformSettings.update({
      where: { key: keyName },
      data: { isEnabled: status, updatedAt: moment().format() },
    });
    await DbService.getInstance().CacheResult<PlatformSettings>(CacheKeys.ServiceSettings(service), setting);
    RedisUtil.client.set('require_services_sync', '1');
  }
  public async GetSettings(service: PlatformServices, noCache?: boolean): Promise<PlatformSettings[]> {
    const cacheKey = CacheKeys.ServiceSettings(service);
    if (cacheKey && !noCache) {
      const status = await DbService.getInstance().HasCache(cacheKey);
      if (status) {
        return (await DbService.getInstance().GetCacheQuery(cacheKey)) as PlatformSettings[];
      } else {
        logger.info('fetching Data from PlatformSettings');
        const $platformWhere = {
          service: service,
          isEnabled: true,
        };
        const platformSettings: PlatformSettings[] = await DbService.getInstance().connection.platformSettings.findMany({
          where: $platformWhere,
        });
        if (!noCache) {
          await DbService.getInstance().CacheResult<PlatformSettings[]>(
            cacheKey,
            platformSettings.map((setting) => {
              delete setting.createdAt;
              delete setting.updatedAt;
              return setting;
            })
          );
        }
        return platformSettings;
      }
    }
    return [];
  }
}
