import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './app/app';
import { theme } from './theme';
import { Auth0Provider } from "@auth0/auth0-react";
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <Auth0Provider domain={process.env['AUTH0_DOMAIN']} clientId={process.env['AUTH0_CLIENT_ID']} redirectUri={window.location.origin}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </Auth0Provider>
  </StrictMode>
);
