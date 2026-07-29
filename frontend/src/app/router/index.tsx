import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ErrorPage } from '@/pages/ErrorPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import MyRequestsPage from '@/pages/MyRequestsPage';
import NewTicketPage from '@/pages/NewTicketPage';
import TicketDetailsPage from '@/pages/TicketDetailsPage';
import { useAuthStore } from '@/features/auth/store/auth.store';

const RootRedirect = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'staff') return <Navigate to="/staff/tickets" replace />;
  if (user.role === 'manager') return <Navigate to="/manager/queue" replace />;
  return <Navigate to="/my-requests" replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <RootRedirect />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'my-requests',
            element: <MyRequestsPage />,
          },
          {
            path: 'new-ticket',
            element: <NewTicketPage />,
          },
          {
            path: 'tickets/:id',
            element: <TicketDetailsPage />,
          },
          {
            path: 'staff/tickets',
            element: (
              <div className="p-8 text-slate-100 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Staff Queue</h1>
                <p className="text-sm text-slate-400">
                  Select any ticket to view details and process status updates.
                </p>
              </div>
            ),
          },
          {
            path: 'manager/queue',
            element: (
              <div className="p-8 text-slate-100 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Manager Ticket Queue</h1>
                <p className="text-sm text-slate-400">
                  Select any ticket to view details, assign staff, or close tickets.
                </p>
              </div>
            ),
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return (
    <RouterProvider
      router={router}
      future={{ v7_startTransition: true }}
    />
  );
};
