import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { ErrorPage } from '@/pages/ErrorPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import MyRequestsPage from '@/pages/MyRequestsPage';
import NewTicketPage from '@/pages/NewTicketPage';
import TicketDetailsPage from '@/pages/TicketDetailsPage';
import { StaffQueuePage } from '@/pages/StaffQueuePage';
import { ManagerQueuePage } from '@/pages/ManagerQueuePage';
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
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
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
            path: 'my-requests',
            element: (
              <ProtectedRoute allowedRoles={['requester', 'staff', 'manager']}>
                <MyRequestsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'new-ticket',
            element: (
              <ProtectedRoute allowedRoles={['requester', 'staff', 'manager']}>
                <NewTicketPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'tickets/:id',
            element: <TicketDetailsPage />,
          },
          {
            path: 'staff/tickets',
            element: (
              <ProtectedRoute allowedRoles={['staff', 'manager']}>
                <StaffQueuePage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'manager/queue',
            element: (
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerQueuePage />
              </ProtectedRoute>
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
