import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { UserRole } from '@/lib/routes.utils';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Check if user is logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permission if specified
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(user.role as UserRole);
    if (!hasRole) {
      return <UnauthorizedPage />;
    }
  }

  return <Outlet />;
};
