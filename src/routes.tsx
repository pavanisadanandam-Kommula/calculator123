import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Loader } from './components/common/Loader';
import { MainLayout } from './components/layout/MainLayout';

const HomePage = lazy(() => import('./pages/Home/Home'));
const AboutPage = lazy(() => import('./pages/About/About'));
const ContactPage = lazy(() => import('./pages/Contact/Contact'));
const DashboardPage = lazy(() => import('./pages/Dashboard/Dashboard'));

const wrap = (Component: ReactNode) => (
  <Suspense fallback={<Loader />}>
    {Component}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: wrap(<HomePage />) },
      { path: 'about', element: wrap(<AboutPage />) },
      { path: 'contact', element: wrap(<ContactPage />) },
      { path: 'dashboard', element: wrap(<DashboardPage />) }
    ]
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-slate-950 px-6 py-20 text-center text-white">
        <h1 className="text-4xl font-semibold">404 — Page not found</h1>
        <p className="mt-4 text-slate-300">Return to the dashboard or use the navigation menu.</p>
      </div>
    )
  }
]);

export default router;
