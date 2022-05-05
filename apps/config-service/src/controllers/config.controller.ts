import { JsonController, Get, Put, Req, BodyParam, Param,UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Ipware } from '@fullerstack/nax-ipware';
import { Service } from 'typedi';
import { authExternalApiServices } from '@balancer/utils-server/middlewares/auth-external-api-services.middleware'
import { BaseResponse } from '@balancer/utils-server/responses/baseResponses';
import {
  PlatformSettingsListResponse,
  PlatformSettingsMessageResponse,
  PlatformSettingsResponse
} from '@balancer/utils-server/responses/PlatformSettingsResponse';
import { queueKeys, queues } from '../jobs';
import RedisUtil from '@balancer/utils-server/utils/redisUtil';
import { logger } from '@balancer/utils-server/utils/logger';
import { PlatformSettingsService } from '@balancer/utils-server/services';

@OpenAPI( {
  security: [],
} )
@Service()
@JsonController( '/config' )
export class ConfigController {
  constructor( private platformSettingsService: PlatformSettingsService ) {
  }

  readonly ipware = new Ipware();

  @Get( '/sync' )
  @OpenAPI( {summary: 'will force request sync request to all micro service'} )
  @ResponseSchema( PlatformSettingsMessageResponse )
  async sync() {
    const response: PlatformSettingsMessageResponse = {
      status: false
    }
    try {
      const totalActiveJobsCount = await queues[queueKeys.sync].queue.getActiveCount();
      if (totalActiveJobsCount === 0 || queues[queueKeys.sync].scheduler.isRunning()) {
        await queues[queueKeys.sync].queue.drain( true )
        await queues[queueKeys.sync].queue.add( queueKeys.sync, {}, {
            attempts: 3,
            priority: 1,
            repeat: {
              cron: '* 0 0 * * *',
            },
          }
        );
        response.data = {status: 1, message: 'Sync Request Sent'}
      } else {
        response.data = {status: 1, message: 'Sync Request Sent'}
      }
      response.status = true
    } catch (e) {
      logger.error( `sync task end up with error (${e.message}`, {error: e} )
      response.errorCode = 500
      response.errors = [`unable sync task`]
    }
    return response
  }

  @Get( '/sync/service' )
  @OpenAPI( {summary: 'will force request sync request to a service'} )
  @ResponseSchema( PlatformSettingsListResponse )
  @UseBefore(authExternalApiServices)
  async syncService() {
    const response: PlatformSettingsListResponse = {
      status: false,
      data: {
        items: [],
        meta: {
          current: 0,
          totalItems: 0,
          totalPages: 1
        }
      }
    }
    try {
      const servicesSettings = await this.platformSettingsService.getServicesSettings();
      response.data.items = servicesSettings
      response.data.meta.totalItems = response.data.items.length
      response.status = true
    } catch (e) {
      logger.error( `sync service end up with error (${e.message}`, {error: e} )
      delete response.data
      response.errorCode = 500
      response.errors = [`unable sync service`]
    }
    return response
  }

  @Get( '/all' )
  @OpenAPI( {summary: 'get all settings without any filters and cache'} )
  @ResponseSchema( PlatformSettingsListResponse )
  async allConfig() {
    const response: PlatformSettingsListResponse = {
      status: false,
      data: {
        items: [],
        meta: {
          current: 0,
          totalItems: 0,
          totalPages: 1
        }
      },
      metaData: {
        requireSync: false
      }
    }
    try {
      response.data.items = await this.platformSettingsService.getServicesSettings()
      response.metaData.requireSync = !!(await RedisUtil.client.get( 'require_services_sync' ))
      response.data.meta.totalItems = response.data.items.length
      response.status = true
    } catch (e) {
      logger.error( `get all settings end up with error (${e.message}`, {error: e} )
      delete response.data
      response.metaData.requireSync = false;
      response.errorCode = 500
      response.errors = [`unable get all settings`]
    }
    return response;
  }

  @Put( '/set/:keyName' )
  @OpenAPI( {
    summary: 'set key setting with new value',
  } )
  async updateSettings( @Param( 'keyName' ) keyName: string, @BodyParam( "value", {required: true} ) value: string, @Req() request: any ) {
    const response: BaseResponse<PlatformSettingsResponse> = {
      status: false,
      data: null
    }
    try {
      if (keyName !== '' && await this.platformSettingsService.HasSettingKey( keyName )) {
        response.data = await this.platformSettingsService.UpdateSettingsValue( keyName, JSON.parse( value ) )
        response.status = true
      }
    } catch (e) {
      logger.error( `Update setting end up with error (${e.message}`, {error: e} )
      response.errorCode = 500
      response.errors = [`unable save ${keyName} setting`]
    }
    return response
  }

  @Put( '/toggle/:keyName' )
  @OpenAPI( {
    summary: 'change key setting if enabled or disabled',
  } )
  async toggleSettings( @Param( 'keyName' ) keyName: string, @Req() request: any ) {
    const response: BaseResponse<void> = {
      status: false,
      metaData: {
        lastStatus: false,
        newStatus: false
      }
    }
    try {
      if (keyName !== '' && await this.platformSettingsService.HasSettingKey( keyName )) {
        const setting = await this.platformSettingsService.GetSettingKey( keyName );
        response.metaData.lastStatus = setting.isEnabled
        await this.platformSettingsService.ToggleSettingStatus( keyName )
        response.metaData.lastStatus = !setting.isEnabled
        response.status = true
      }
    } catch (e) {
      logger.error( `Update setting end up with error (${e.message}`, {error: e} )
      response.errorCode = 500
      response.errors = [`unable save ${keyName} setting`]
    }
    return response
  }

}
