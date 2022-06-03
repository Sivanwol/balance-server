import { GraphQLSchema } from 'graphql';
import { addDirectiveResolveFunctionsToSchema } from 'graphql-directive';
// schema for all custom directives
const customDirectivesSchema = `
`;

// attaches the custom directives resolvers to the schema
const attachDirectives = ( schema: GraphQLSchema ): GraphQLSchema => {
  addDirectiveResolveFunctionsToSchema( schema, {
    deprecated( resolve ) {
      return resolve();
    },
  } );
  return schema;
};

export default {
  attachDirectives,
  schema: customDirectivesSchema,
};
