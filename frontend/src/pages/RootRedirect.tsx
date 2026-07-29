import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { getHomeRouteForRole } from '@/lib/routes.utils';

export const RootRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const targetRoute = getHomeRouteForRole(user.role);
  return <Navigate to={targetRoute} replace />;
};
