import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './app/app';
import { theme } from './theme';
import { Auth0Provider } from "@auth0/auth0-react";
import { environment } from './environments/environment';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <Auth0Provider domain={environment.AUTH0_DOMAIN} clientId={environment.AUTH0_CLIENT_ID} redirectUri={`${window.location.origin}/overview`}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </Auth0Provider>
  </StrictMode>
);
