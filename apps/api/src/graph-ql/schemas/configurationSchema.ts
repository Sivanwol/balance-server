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
    type ConfigurationClientPlatform {
      # config key
      key: String
      # config value
      value: String
    }
    # platform side configuration (both client and server)
    type ConfigurationClientPlatform {
      # config key
      key: String
      # config value
      value: String
      # service name
      service: String
      # is config is for client side
      isClient: Boolean
      # is config is for secure client side
      isSecureClient: Boolean
    }
  `;

  query = `
    # fetch client side config
    clientSideConfiguration(isSecure: Boolean): [ConfigurationClientPlatform]
    # fetch relevant config
    configuration(key: String!): [ConfigurationClientPlatform]

  `;

  mutation = `
  `;
  // verifiedRequestMobile(userId: String!, type: VerifiedType!, code: Int!): Boolean
  subscription = `
  `;

  resolver = {
    Query: {
      clientSideConfiguration: async ( root, {isSecure}, context ) => {
        const {req, res} = context
        const ip = this.ipware.getClientIP( req )
        logger.info(`Client Request: ${ip}`);
        logger.info(`Request all configurations`)
        return (await this.configService.GetServiceSettings(PlatformServices.API, {isSecure}))
      },
      configuration: async ( root, {key}, context ) => {
        const {req, res} = context
        const ip = this.ipware.getClientIP( req )
        logger.info(`Client Request: ${ip}`);
        if (key === ''){
          logger.info(`Request all configurations`)
          return (await this.configService.GetServiceSettings(PlatformServices.API))
        }
        logger.info(`Request configuration with key ${key}`)
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
