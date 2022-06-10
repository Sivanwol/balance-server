import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './app/app';
import { theme } from './theme';
import { Auth0Context, Auth0Provider } from '@auth0/auth0-react';
import { ApolloProviderWithAuth0 } from '@applib/backoffice-common';
import { environment } from './environments/environment';
import { ApolloProvider } from '@apollo/client';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <Auth0Provider
      domain={environment.AUTH0_DOMAIN}
      clientId={environment.AUTH0_CLIENT_ID}
      scope="read:current_user update:current_user_metadata"
      redirectUri={`${window.location.origin}/overview`}
    >
      <Auth0Context.Consumer>
        {(auth0Client) => {
          return (
            <ApolloProvider client={ApolloProviderWithAuth0(environment, auth0Client)}>
              <ChakraProvider theme={theme}>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </ChakraProvider>
            </ApolloProvider>
          );
        }}
      </Auth0Context.Consumer>
    </Auth0Provider>
  </StrictMode>
);
