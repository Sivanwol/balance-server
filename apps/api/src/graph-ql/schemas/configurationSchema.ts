import ISchema from './ISchema';
import { Ipware } from '@fullerstack/nax-ipware';
import { Container } from 'typedi';
import { ConfigService, UsersService } from '@balancer/utils-server/services';
import { logger } from '@balancer/utils-server/utils/logger';
import { PlatformServices } from '@prisma/client';

export class ConfigurationSchema implements ISchema {
  readonly usersService = Container.get( UsersService ) as UsersService;
  readonly configService = Container.get( ConfigService ) as ConfigService;
  readonly ipware = new Ipware();
  type = `
    # platform client side configuration
    type ConfigurationPlatform {
      # config key
      key: String
      # config value
      value: String
    }
  `;

  query = `
    # fetch relevant config
    configuration(key: String!): [ConfigurationPlatform]
  `;

  mutation = `
  `;
  // verifiedRequestMobile(userId: String!, type: VerifiedType!, code: Int!): Boolean
  subscription = `
  `;

  resolver = {
    Query: {
      configuration: async ( root, {key}, context ) => {
        const {req, res} = context
        const ip = this.ipware.getClientIP( req )
        if (key === ''){
          logger.info(`Request all client configurations`)
          return (await this.configService.GetServiceSettings(PlatformServices.API))
        }
        logger.info(`Request client configuration with key ${key}`)
        return [await this.configService.GetServiceSettingsByKey(PlatformServices.API,key)];
      }
    },
    Mutation: {
    },
    User: {
      // author: ( post ) => authorCore.getAuthor( post.authorId ),
    },
    Subscription: {}
  };
}
