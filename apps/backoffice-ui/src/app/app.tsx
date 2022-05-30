// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.styl';
import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';
import MainLayout from '../layout/main';
import IntroLayout from '../layout/intro';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';
import Intro from '../pages/intro/intro';

const renderAuthUser = () => (
  <MainLayout>
    <NxWelcome title="backoffice-ui" />
    <div />
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
    return (
      <MainLayout>
        <div>Loading ...</div>
      </MainLayout>
    );
  }
  return (
    <>
      {isAuthenticated ? renderAuthUser() : renderNoAuthUser(loginWithRedirect)}
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route path="/">
          <Intro />
        </Route>
        <Route path="/overview">
            </Route>
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default App;
