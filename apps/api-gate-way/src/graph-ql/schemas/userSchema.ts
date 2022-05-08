import ISchema from './ISchema';
import { Ipware } from '@fullerstack/nax-ipware';
import { Container } from 'typedi';
import { UserModel } from '@balancer/utils-server/models/user.model';
import { UsersService } from '@balancer/utils-server/services';
import { logger } from '@balancer/utils-server/utils/logger';
import { User } from '@prisma/client';

export class UserSchema implements ISchema {
  readonly usersService = Container.get( UsersService ) as UsersService;
  readonly ipware = new Ipware();
  type = `
    # when request forget password this the model
    type UserProfile {
      # user first name
      firstName: String
      # user last name
      lastName: String
      # user email
      email: String!
      # user phone
      phone: String
    }
  `;

  query = `
    # Get User own Profile
    me: UserProfile @isAuthenticated
  `;

  mutation = `
  `;
  subscription = `
  `;

  resolver = {
    Query: {
      // eslint-disable-next-line no-empty-pattern
      me: async ( root, {}, context ) => {
        const {req, res} = context
        return req.user as UserModel;
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
