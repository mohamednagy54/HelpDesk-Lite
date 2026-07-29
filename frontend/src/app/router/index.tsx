import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from './ProtectedRoute';
import { ErrorPage } from '@/pages/ErrorPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RootRedirect } from '@/pages/RootRedirect';
import { MyRequestsPage } from '@/pages/MyRequestsPage';
import { NewTicketPage } from '@/pages/NewTicketPage';
import { TicketDetailsPage } from '@/pages/TicketDetailsPage';
import { StaffTicketsPage } from '@/pages/StaffTicketsPage';
import { ManagerQueuePage } from '@/pages/ManagerQueuePage';
import { ManagerSummaryPage } from '@/pages/ManagerSummaryPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />, // Base auth guard for all app shell routes
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <RootRedirect />,
          },
          {
            path: 'dashboard',
            element: <RootRedirect />,
          },
          {
            element: <ProtectedRoute allowedRoles={['requester', 'staff']} />,
            children: [
              {
                path: 'my-requests',
                element: <MyRequestsPage />,
              },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={['requester']} />,
            children: [
              {
                path: 'new-ticket',
                element: <NewTicketPage />,
              },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={['requester', 'staff', 'manager']} />,
            children: [
              {
                path: 'tickets/:id',
                element: <TicketDetailsPage />,
              },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={['staff']} />,
            children: [
              {
                path: 'staff/tickets',
                element: <StaffTicketsPage />,
              },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={['manager']} />,
            children: [
              {
                path: 'manager/queue',
                element: <ManagerQueuePage />,
              },
              {
                path: 'manager/summary',
                element: <ManagerSummaryPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
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
