// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layout/main';
import IntroLayout from '../layout/intro';
import Intro from '../pages/intro/intro';
import { ProtectedRoute } from '@applib/backoffice-common';
import Overview from '../pages/overview/overview';
import { NotFound } from '../pages/not-found/not-found';
import { useAuth0 } from '@auth0/auth0-react';
import Configuration from '../pages/configuration/configuration';
const authenticateRoutes = () => (
  <>
    <Route path="/" element={<ProtectedRoute component={Overview} />} />
    <Route path="/configuration" element={<ProtectedRoute component={Configuration} />} />
    <Route path="/overview" element={<ProtectedRoute component={Overview} />} />
  </>
);
const noneAuthenticateRoutes = () => (
  <>
    <Route path="/" element={<Intro />} />
    <Route path="/login" element={<Intro />} />
  </>
);
export function App() {
  const { isAuthenticated } = useAuth0();
  console.log(isAuthenticated);
  return (
    <>
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <Routes>
        <Route
          element={
            !isAuthenticated ? (
              <IntroLayout>
                <Outlet />
              </IntroLayout>
            ) : (
              <MainLayout>
                <Outlet />
              </MainLayout>
            )
          }
        >
          {!isAuthenticated ? noneAuthenticateRoutes() : authenticateRoutes()}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default App;
