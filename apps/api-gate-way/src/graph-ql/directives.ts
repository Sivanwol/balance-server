import { isAuthTokenValidGQL } from '@balancer/utils-server/middlewares/auth.middleware';
import { GraphQLSchema } from 'graphql';
import { addDirectiveResolveFunctionsToSchema } from 'graphql-directive';
import { get } from 'lodash';
import { Container } from 'typedi';
import { UsersService } from '@balancer/utils-server/services';
import { logger } from '@balancer/utils-server/utils/logger';
import { AuthorizationError } from '@balancer/utils-server/exceptions/AuthorizationError';
// schema for all custom directives
const customDirectivesSchema = `
  # Checking if user is Authenticated
  directive @isAuthenticated on QUERY | FIELD_DEFINITION
  # Checking if user has matching permissions (work in two mods matchAll = true mean all permissions must be including , matchAll = false mean any permissions need be include)
  directive @hasScopeByPermissions(permissions: [String]) on QUERY | FIELD_DEFINITION

`;

// attaches the custom directives resolvers to the schema
const attachDirectives = ( schema: GraphQLSchema ): GraphQLSchema => {
  const userService = Container.get(UsersService);
  addDirectiveResolveFunctionsToSchema( schema, {
    async isAuthenticated( resolve, source, args, context ) {
      const {req, res } = context
      const { authorization: token } = req.headers;

      try {
        const { error } = await isAuthTokenValidGQL(token)
        if (!error){
          throw new AuthorizationError( "authorization not found user" );
        }
        return resolve();
      } catch (err) {
        logger.warn( `user auth not passing ${err.message}` )
        throw new Error( 'Unauthorized' );
      }
    },
    async hasScopeByPermissions( resolve, source, args, context ) {
      const {req, res} = context
      const { authorization: token } = req.headers;
      try {
        const { error, decoded } = await isAuthTokenValidGQL(token)
        if (!error) {
          throw new AuthorizationError( "authorization not found user" );
        }
        const permissions = get( args, 'permissions', [] )
        if (permissions.length == 0) {
          return resolve();
        }
        if (permissions.length > 0) {
          if (decoded.permissions && decoded.permissions.length > 0) {
            if (decoded.permissions.filter(perm => decoded.permissions.includes(perm)).length > 0) {
              return resolve();
            }
          }
        }
        logger.error( 'Error: insufficient permissions' );
        throw new AuthorizationError( "insufficient permissions" );
      } catch (err) {
        logger.warn( `user auth not passing ${err.message}` )
        throw new Error( 'Unauthorized' );
      }
    }
  } );
  return schema;
};

export default {
  attachDirectives,
  schema: customDirectivesSchema,
};
