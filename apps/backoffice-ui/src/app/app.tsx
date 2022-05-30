// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.styl';

import { Route, Routes, Link } from 'react-router-dom';
import MainLayout from '../layout/main';
import IntroLayout from '../layout/intro';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';
import Intro from '../pages/intro/intro';
import { Loader, ProtectedRoute } from '@balancer/backoffice-common';
import Overview from '../pages/overview/overview';
import NotFound from '../pages/not-found/not-found';

const renderAuthUser = () => (
  <MainLayout>
    <Intro />
  </MainLayout>
);
const renderNoAuthUser = (loginWithRedirect: any) => (
  <IntroLayout>
    <Button onClick={() => loginWithRedirect()}>Login</Button>
  </IntroLayout>
);
export function App() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    if (isAuthenticated) {
      return (
        <MainLayout>
          <Loader />
        </MainLayout>
      );
    }
    return (
      <IntroLayout>
        <Loader />
      </IntroLayout>
    );
  }
  return (
    <>
      {isAuthenticated ? renderAuthUser() : renderNoAuthUser(loginWithRedirect)}
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/overview" element={<ProtectedRoute component={Overview} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default App;
