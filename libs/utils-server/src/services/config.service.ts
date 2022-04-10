import { Service } from 'typedi';
import { PlatformSettings } from '@prisma/client';
import { logger } from '../utils/logger';
import { DbService } from './db.service';
import { CacheKeys } from '../constraints/CacheKeys';
import { Configuration, ConfigurationMessage } from '../interfaces/IConfiguration';

@Service()
export class ConfigService {
  private configData: PlatformSettings[] = [];

  public async GetServiceSettings( forceReload?: boolean ): Promise<PlatformSettings[]> {
    if (this.configData.length === 0 || forceReload)
      await this.reloadServiceSettings()
    return this.configData;
  }

  public async GetServiceSettingsByKey( key: string, forceReload?: boolean ): Promise<PlatformSettings> {
    if (this.configData.length === 0 || forceReload)
      await this.reloadServiceSettings()
    return this.configData[key]
  }

  private async reloadServiceSettings() {
    logger.info( "received service request => GetServiceSettings" );
    let globalConfig: PlatformSettings[] = []
    let serviceConfig
    let status = await DbService.getInstance().HasCache( CacheKeys.GlobalSettings )
    if (status)
      globalConfig = await DbService.getInstance().GetCacheQuery( CacheKeys.GlobalSettings ) as PlatformSettings[];
    // @ts-ignore
    status = await DbService.getInstance().HasCache( CacheKeys.ServiceSettings( process.env.MICROSERVICE_Group ) )
    if (status) {
      // @ts-ignore
      serviceConfig = await DbService.getInstance().GetCacheQuery( CacheKeys.ServiceSettings( process.env.MICROSERVICE_Group ) ) as PlatformSettings[];
    }
    if (globalConfig && serviceConfig) {
      console.log( `service config`, [...globalConfig, ...serviceConfig] )
      this.configData = [...globalConfig, ...serviceConfig]
    }
  }

  public async SetServiceSettings( payload: ConfigurationMessage[] ) {
    const records = payload.map( item => {
      item.global = (!(item.service && item.service !== ""));
      return item;
    } )

    let status = await DbService.getInstance().HasCache( CacheKeys.GlobalSettings )
    if (status)
      await DbService.getInstance().RemoveCache( CacheKeys.GlobalSettings )
    await DbService.getInstance().CacheResult<Configuration>( CacheKeys.GlobalSettings, {items: records.filter( item => item.global )} );

    // @ts-ignore
    const cacheKey = CacheKeys.ServiceSettings( process.env.MICROSERVICE_Group );
    status = await DbService.getInstance().HasCache( cacheKey )
    if (status)
      await DbService.getInstance().RemoveCache( cacheKey )
    await DbService.getInstance().CacheResult<Configuration>( cacheKey, {items: records.filter( item => item.global )} );
  }
}
