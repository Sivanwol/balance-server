import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Auth0ContextInterface } from '@auth0/auth0-react';

export const ApolloProviderWithAuth0 = (environment: any, auth0Client: Auth0ContextInterface) => {
  const { getAccessTokenSilently } = auth0Client;

  const httpLink = new HttpLink({
    uri: environment.OPERATIONS_SERVICE,
  });

  const authLink = setContext(async (_, { headers, ...rest }) => {
    let token;
    try {
      token = await getAccessTokenSilently();
    } catch (error) {
      console.log(error);
    }

    if (!token) return { headers, ...rest };

    return {
      ...rest,
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
