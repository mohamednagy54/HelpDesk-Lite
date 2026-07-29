import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ErrorPage } from '@/pages/ErrorPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import Register from '@/pages/Register';
import { MyRequestsPage } from '@/pages/MyRequestsPage';
import { NewTicketPage } from '@/pages/NewTicketPage';
import { TicketDetailsPage } from '@/pages/TicketDetailsPage';
import { StaffTickets } from '@/pages/StaffTickets';
import { ManagerQueue } from '@/pages/ManagerQueue';

// --- Root redirect based on role ---
const RootRedirect = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'staff') return <Navigate to="/staff/tickets" replace />;
  if (user.role === 'manager') return <Navigate to="/manager/queue" replace />;
  return <Navigate to="/my-requests" replace />;
};

// --- Auth guard ---
const RequireAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

// --- Role guard ---
const RequireRole = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const user = useAuthStore((state) => state.user);
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'login',    element: <LoginPage /> },
      { path: 'register', element: <Register /> },
      {
        element: <RequireAuth />,
        children: [
          { index: true, element: <RootRedirect /> },

          {
            element: <RequireRole allowedRoles={['requester', 'staff', 'manager']} />,
            children: [
              { path: 'my-requests', element: <MyRequestsPage /> },
              { path: 'tickets/:id', element: <TicketDetailsPage /> },
              { path: 'new-ticket',  element: <NewTicketPage /> },
            ],
          },

          {
            element: <RequireRole allowedRoles={['staff', 'manager']} />,
            children: [
              { path: 'staff/tickets', element: <StaffTickets /> },
            ],
          },

          {
            element: <RequireRole allowedRoles={['manager']} />,
            children: [
              { path: 'manager/queue', element: <ManagerQueue /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export const AppRouter = () => {
  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  );
};
