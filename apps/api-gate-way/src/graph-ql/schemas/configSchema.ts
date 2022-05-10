import ISchema from './ISchema';
import { Ipware } from '@fullerstack/nax-ipware';
import { Container } from 'typedi';
import { UserModel } from '@balancer/utils-server/models/user.model';
import { UsersService } from '@balancer/utils-server/services';

export class ConfigSchema implements ISchema {
  readonly usersService = Container.get( UsersService ) as UsersService;
  readonly ipware = new Ipware();
  type = `
    # when request forget password this the model
    type Config {
      # config key
      key: String!
      # service name
      service: String!
      # user first name
      value: String
      createdAt: Date
      updatedAt: Date
    }
  `;

  query = `
    # Get list of configs from a config service
    getConfig(serviceName: String!, key: String): User[] @hasScopeByPermissions(permissions: ["platform_control"])
  `;

  mutation = `
  `;
  subscription = `
  `;

  resolver = {
    Query: {
      getConfig: async ( root, {serviceName , key}, context ) => {
        const {req, res} = context;
        if (serviceName === '') {
          throw new Error('unable fetch all platform service config service name required')
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
