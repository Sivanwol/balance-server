// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Route, Routes, Link } from 'react-router-dom';
import MainLayout from '../layout/main';
import IntroLayout from '../layout/intro';
import Intro from '../pages/intro/intro';
import { ProtectedRoute } from '@balancer/backoffice-common';
import Overview from '../pages/overview/overview';
import { NotFound } from '../pages/not-found/not-found';

export function App() {
  return (
    <>
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <Routes>
        <Route path="/" element={<IntroLayout><Intro /></IntroLayout>} />
        <Route path="/overview" element={<MainLayout><ProtectedRoute component={Overview} /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default App;
