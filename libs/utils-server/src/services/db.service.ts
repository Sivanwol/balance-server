/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PlatformSettings, PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import prisma from '../utils/prisma';
import RedisUtil from '../utils/redisUtil';
import { logger } from '../utils/logger';
import { CacheKeys } from '../constraints/CacheKeys';

interface CacheSettings {
  ttl: number;
  prefix: string;
  keyFormat: string;
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}

@Service()
export class DbService {
  public readonly connection: PrismaClient
  private readonly cacheSettings: CacheSettings = {
    prefix: process.env.DB_REDIS_CACHING_KEY as string,
    keyFormat: '##prefix##:##key##',
    ttl: parseInt( process.env.REDIS_DEFAULT_EXPIRE as string ) * 60
  }

  private static instance: DbService;
  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }

    return DbService.instance;
  }

  private constructor() {
    this.connection = prisma;
    (async () => {
      await this.initConnection()
    }).call( this );
  }

  public CacheResult<T>( keyName: string, result: T, ttl?: number ) {
    try {
      logger.info( `Setting Cache Key ${keyName}` );
      const key = this.getCacheKey( keyName );
      const value = (typeof (result) !== 'string') ? JSON.stringify( result ) : `${result}`
      if (!ttl)
        RedisUtil.client.set( key, value )
      else
        RedisUtil.client.set( key, value, 'ex', ttl )
    } catch (e) {
      logger.error( `Saving Cache Key ${keyName} resulted with an error` )
      logger.error( e )
    }
  }

  public async HasCache( keyName: string ) {
    logger.info( `Checking if Cache Key ${keyName} exists` );
    const key = this.getCacheKey( keyName );
    return await RedisUtil.exists( key )
  }

  public async RemoveCache( keyName: string ) {
    const key = this.getCacheKey( keyName );
    await RedisUtil.del( key )
  }

  public async GetCacheQuery( keyName: string ) {
    logger.info( `Getting Cache Key ${keyName}` );
    const key = this.getCacheKey( keyName );
    const result = await RedisUtil.get( key );
    try {
      return JSON.parse(  result || '{}')
    } catch (e) {
      logger.error( `Cache key - ${keyName} got corrupted value ${result}` )
      logger.error( e )
      await this.RemoveCache( keyName )
    }
    return null;
  }

  public async ForceClearCache() {
    logger.info( `Force Delete All Cache Keys` );
    const keys = await RedisUtil.keys( `${process.env.DB_REDIS_CACHING_KEY}:*` )
    for (const key in keys) {
      await RedisUtil.del( key )
    }
  }


  private async initConnection() {
    logger.info( `Init Database Connection` );
    await this.initDbCache();
  }

  private getCacheKey( keyName: string ): string {
    const keyFormat: string = this.cacheSettings.keyFormat;
    const returnKeyName = keyFormat
      .replace( '##prefix##', this.cacheSettings.prefix )
      .replace( '##key##', keyName );
    return returnKeyName;
  }

  private async initDbCache( forceClearCache?: boolean ) {
    logger.info( `Init Cache Db` );
    if (forceClearCache)
      await this.ForceClearCache()
    logger.info( `Validate Cache Db` );
    const totalItemPlatformSettings = await this.connection.platformSettings.count();
    const globalSettings = await this.GetCacheQuery( CacheKeys.GlobalSettings ) as PlatformSettings[]
    if (!globalSettings || globalSettings && globalSettings.length <= 0) {
      if (globalSettings && globalSettings.length <= 0) {
        // we need remove the cache as it missing a lot of data and need rebuild
        await this.ForceClearCache()
      }
      await this.buildCacheDb();
    } else {
      if (globalSettings.length > 0 && globalSettings.length !== totalItemPlatformSettings) {
        await this.buildCacheDb();
      }
    }
  }

  private async buildCacheDb() {
    // we reset critical keys on cache
    await this.RemoveCache( CacheKeys.GlobalSettings )
    // we do fetching for critical data
    const playformSettings: PlatformSettings[] = await this.connection.platformSettings
      .findMany( {
        where: {
          isEnabled: true,
        }
      } )
    this.CacheResult<PlatformSettings[]>( CacheKeys.GlobalSettings, playformSettings )
  }
}
