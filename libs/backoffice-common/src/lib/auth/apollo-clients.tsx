import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
export const publicGQLClient = (environment:any) =>(new ApolloClient({
  uri: environment.OPERATIONS_SERVICE,
  cache: new InMemoryCache()
}));

export const secureGQLClient  = (environment:any, getAccessTokenSilently:any) => {
  const httpLink = createHttpLink({
    uri: environment.OPERATIONS_SERVICE, // your URI here...
  });


  const authLink = setContext(async () => {
    const token = await getAccessTokenSilently();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true
  });

}
