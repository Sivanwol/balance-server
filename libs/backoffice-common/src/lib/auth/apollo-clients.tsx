import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

export const publicGQLClient = (environment:any) =>(new ApolloClient({
  uri: environment.GQL_PUBLIC_URI,
  cache: new InMemoryCache()
}));

export const secureGQLClient  = (environment:any, getAccessTokenSilently:any) => {
  const httpLink = createHttpLink({
    uri: environment.GQL_SECURE_URI, // your URI here...
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

function createHttpLink(arg0: { uri: string; }) {
  throw new Error("Function not implemented.");
}


function setContext(arg0: () => Promise<{ headers: { Authorization: string; }; }>) {
  throw new Error("Function not implemented.");
}
