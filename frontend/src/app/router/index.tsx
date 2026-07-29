import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { ErrorPage } from '@/pages/ErrorPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

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
            element: <Navigate to="/my-requests" replace />,
          },
          {
            path: 'my-requests',
            element: (
              <ProtectedRoute allowedRoles={['requester', 'staff']}>
                <div className="p-8 text-slate-100">My Requests Page</div>
              </ProtectedRoute>
            ),
          },
          {
            path: 'staff/tickets',
            element: (
              <ProtectedRoute allowedRoles={['staff']}>
                <div className="p-8 text-slate-100">Staff Queue Page</div>
              </ProtectedRoute>
            ),
          },
          {
            path: 'manager/queue',
            element: (
              <ProtectedRoute allowedRoles={['manager']}>
                <div className="p-8 text-slate-100">Manager Queue Page</div>
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
  return <RouterProvider router={router} />;
};
