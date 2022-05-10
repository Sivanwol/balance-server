import { logger } from './../../../../../libs/jest-common/src/LoggerMock';
import { IsBoolean } from 'class-validator';
import ISchema from './ISchema';
import { Ipware } from '@fullerstack/nax-ipware';
import { Container } from 'typedi';
import { RequestMethod, RequestService, UsersService } from '@balancer/utils-server/services';
import { ServicesRoute } from '@balancer/utils-server/constraints/knownservices';
import { PlatformSettingsListResponse } from '@balancer/utils-server/responses/PlatformSettingsResponse';

interface Config {
  key: string;
  isEnabled: boolean;
  value: string;
  updatedAt: Date;
}
export class ConfigSchema implements ISchema {
  readonly usersService = Container.get( UsersService ) as UsersService;
  readonly ipware = new Ipware();
  type = `
    # when request forget password this the model
    type Config {
      # config key
      key: String!
      # config enabled
      isEnabled: Boolean!
      # user first name
      value: String
      # when this config key been updated
      updatedAt: Date
    }
  `;

  query = `
    # Get list of configs from a config service
    getConfig(serviceName: String!, key: String): [Config] @hasScopeByPermissions(permissions: ["platform_control"])
  `;

  mutation = `
  `;
  subscription = `
  `;

  resolver = {
    Query: {
      getConfig: async ( root, {serviceName , key}, context ) => {
        const {req, res} = context;
        const requester = new RequestService();
        requester.initRequest(ServicesRoute.ConfigService);
        if (serviceName === '') {
          throw new Error('unable fetch all platform service config service name required')
        }
        const resp = await requester.request<PlatformSettingsListResponse>(RequestMethod.GET, `config/list/${serviceName}`, {key})
        let configItems: Config[] = []
        let errors: string[] = [];
        if (resp && resp.status === 200 && resp.data && resp.status) {
          configItems =  [...resp.data.data.items.map(platformSetting => ({
            key: platformSetting.key,
            isEnabled: platformSetting.isEnabled,
            value: JSON.stringify(platformSetting.value || {}),
            updatedAt: platformSetting.updatedAt
          }))]
        } else {
            if (resp && resp.status === 200 && !resp.status) {
              errors =  resp.data.errors
            } else {
              logger.error(`Error on request platform config has status code (${resp.status}) => ${resp.statusText}`)
            }
        }
        return {
          items: configItems,
          errors
        }
      },
    },
    Mutation: {
    },
    User: {
      // author: ( post ) => authorCore.getAuthor( post.authorId ),
    },
    Subscription: {}
  };
}
