import ISchema from './ISchema';
import { Ipware } from '@fullerstack/nax-ipware';
import { Container } from 'typedi';
import { UserModel } from '@wolberg-pro-games/utils-server/models/user.model';
import { UsersService } from '@wolberg-pro-games/utils-server/services';
import { logger } from '@wolberg-pro-games/utils-server/utils/logger';
import { User } from '@prisma/client';

export class UserSchema implements ISchema {
  readonly usersService = Container.get( UsersService ) as UsersService;
  readonly ipware = new Ipware();
  type = `
    # when request forget password this the model
    type ForgetPasswordUser {
      # If request approved
      status: Boolean!
      # Any error message
      message: String
      # Security hashing for if client want do the handling
      hashing: String
    }
  `;

  query = `
    # Get User own Profile
    me: User @isAuthenticated
    # Test scope with users_modify permission
    testScopePermission: Boolean @hasScopeByPermissions(permissions: ["users_modify"], matchAll: false)
    # Test scope with users_admin role
    testScopeRole: Boolean @hasScopeByRoles(roles: ["users_admin"], matchAll: false)
    # Get boolean if has user register with this email
    hasUserWithEmail(email: String!): Boolean
  `;

  mutation = `
    # Send forget password for a user
    forgotPassword(email: String!): ForgetPasswordUser
    # Change password
    changePassword(oldPassword: String! , newPassword: String!): Boolean @isAuthenticated
  `;
  // verifiedRequestMobile(userId: String!, type: VerifiedType!, code: Int!): Boolean
  subscription = `
  `;

  resolver = {
    Query: {
      me: async ( root, {}, context ) => {
        const {req, res} = context
        return req.user as UserModel;
      },
      hasUserWithEmail: async ( root, {email}, context ) => {
        const {req, res} = context
        const user = await this.usersService.findUserByEmail( email, true )
        return user;
      },
      testScopePermission: async ( root, {showAll}, context ) => {
        const {req, res} = context
        return true
      },
      testScopeRole: async ( root, {showAll}, context ) => {
        const {req, res} = context
        return true
      },
    },
    Mutation: {
      forgotPassword: async ( root, {email}, context ) => {
        const {req, res} = context
        const ip = this.ipware.getClientIP( req )
        const user = await this.usersService.findUserByEmail( email )
        logger.info( `request forget password for ${email}` );
        if (!user) return false
        await this.usersService.requestUserForgetPassword( user.id, ip )
        return true;
      },

      changePassword: async ( root, {oldPassword, newPassword}, context ) => {
        const {req} = context
        const ip = this.ipware.getClientIP( req )
        const {user} = req
        if (!user) return false
        logger.info( `request change password for ${user.id}` );
        await this.usersService.resetUserPassword( user.id, oldPassword, newPassword, ip )
        return true
      }
    },
    User: {
      // author: ( post ) => authorCore.getAuthor( post.authorId ),
    },
    Subscription: {}
  };
}
