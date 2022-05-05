import { PlatformSettings } from '@prisma/client';
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
  public async getServicesSettings() {
    logger.info('fetching Data from getServicesSettings');
    let platformSettings: PlatformSettings[] = [];
    for (const service of knownServices) {
      if (service) {
        const settings = await this.GetSettings(service);
        if (settings && isArray(settings))
          platformSettings = [...platformSettings, ...settings];
      }
    }
    return platformSettings;
  }

  public async HasGlobalSettingKey(keyName: string) {
    logger.info('received service request => HasGlobalSettingKey');
    const status = await DbService.getInstance().HasCache(
      CacheKeys.GlobalSettings
    );
    if (!status) {
      const playformSettings: PlatformSettings =
        await DbService.getInstance().connection.platformSettings.findFirst({
          where: {
            key: keyName,
            isEnabled: true,
          },
        });
      if (!playformSettings) return false;
    } else {
      // we need verify if it on cache
      const playformSettings: PlatformSettings[] =
        (await DbService.getInstance().GetCacheQuery(
          CacheKeys.GlobalSettings
        )) as PlatformSettings[];
      const locateSettings = find(playformSettings, { key: keyName });
      if (!locateSettings) {
        const playformSettings: PlatformSettings =
          await DbService.getInstance().connection.platformSettings.findFirst({
            where: {
              key: keyName,
              isEnabled: true,
            },
          });
        if (!playformSettings) return false;
      }
    }
    return true;
  }

  public async HasSettingKey(keyName: string) {
    logger.info('received service request => HasSettingKey');
    const playformSettings: PlatformSettings =
      await DbService.getInstance().connection.platformSettings.findFirst({
        where: {
          key: keyName,
          isEnabled: true,
        },
      });
    return !!playformSettings;
  }

  public async GetSettingKey(keyName: string) {
    logger.info('received service request => GetSettingKey');
    const playformSettings: PlatformSettings =
      await DbService.getInstance().connection.platformSettings.findFirst({
        where: {
          key: keyName,
          isEnabled: true,
        },
      });
    return playformSettings;
  }

  public async HasGlobalSettingCacheKey(keyName: string) {
    logger.info('received service request => HasGlobalSettingCacheKey');
    const status = await DbService.getInstance().HasCache(
      CacheKeys.GlobalSettings
    );
    if (status) {
      // we need verify if it on cache
      const playformSettings: PlatformSettings[] =
        (await DbService.getInstance().GetCacheQuery(
          CacheKeys.GlobalSettings
        )) as PlatformSettings[];
      const locateSettings = find(playformSettings, { key: keyName });
      if (!locateSettings) {
        return false;
      }
    }
    return true;
  }

  public async UpdateSettingsValue(keyName: string, valueObj: any) {
    logger.info('received service request => UpdateSettingsValue');
    if (await this.HasGlobalSettingKey(keyName)) {
      await DbService.getInstance().RemoveCache(CacheKeys.GlobalSettings);
    }
    const setting =
      await DbService.getInstance().connection.platformSettings.update({
        where: { key: keyName },
        data: { value: valueObj, updatedAt: moment().format() },
      });
    logger.info('re save cache Data for PlatformSettings');
    await DbService.getInstance().CacheResult<PlatformSettings>(
      CacheKeys.GlobalSettings,
      setting
    );
    RedisUtil.client.set('require_services_sync', '1');
    return setting;
  }

  public async ToggleSettingStatus(keyName: string) {
    logger.info('received service request => ToggleSettingStatus');

    if (await this.HasGlobalSettingKey(keyName)) {
      await DbService.getInstance().RemoveCache(CacheKeys.GlobalSettings);
    }
    const playformSettings: PlatformSettings =
      await DbService.getInstance().connection.platformSettings.findFirst({
        where: {
          key: keyName,
        },
      });
    const status = !playformSettings.isEnabled;
    const setting =
      await DbService.getInstance().connection.platformSettings.update({
        where: { key: keyName },
        data: { isEnabled: status, updatedAt: moment().format() },
      });
    await DbService.getInstance().CacheResult<PlatformSettings>(
      CacheKeys.GlobalSettings,
      setting
    );
    RedisUtil.client.set('require_services_sync', '1');
  }
  public async GetSettings(service: string): Promise<PlatformSettings[]> {
    const cacheKey = !service
      ? CacheKeys.GlobalSettings
      : CacheKeys.ServiceSettings(service);
    if (cacheKey) {
      const status = await DbService.getInstance().HasCache(cacheKey);
      if (status) {
        return (await DbService.getInstance().GetCacheQuery(
          cacheKey
        )) as PlatformSettings[];
      } else {
        logger.info('fetching Data from PlatformSettings');
        const platformSettings: PlatformSettings[] =
          await DbService.getInstance().connection.platformSettings.findMany({
            where: {
              service: service,
              isEnabled: true,
            },
          });
        await DbService.getInstance().CacheResult<PlatformSettings[]>(
          cacheKey,
          platformSettings.map((setting) => {
            delete setting.createdAt;
            delete setting.updatedAt;
            return setting;
          })
        );
        return platformSettings;
      }
    }
    return [];
  }
}
