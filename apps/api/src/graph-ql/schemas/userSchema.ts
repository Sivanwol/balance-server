import ISchema from './ISchema';
import { Ipware } from '@fullerstack/nax-ipware';
import { Container } from 'typedi';
import { UsersService } from '@balancer/utils-server/services';
import { logger } from '@balancer/utils-server/utils/logger';

export class UserSchema implements ISchema {
  readonly usersService = Container.get( UsersService ) as UsersService;
  readonly ipware = new Ipware();
  type = `
  `;

  query = `
  `;

  mutation = `
  `;
  // verifiedRequestMobile(userId: String!, type: VerifiedType!, code: Int!): Boolean
  subscription = `
  `;

  resolver = {
    Query: {
    },
    Mutation: {
    },
    User: {
      // author: ( post ) => authorCore.getAuthor( post.authorId ),
    },
    Subscription: {}
  };
}
