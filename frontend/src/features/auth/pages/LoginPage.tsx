import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuthStore } from '../store/auth.store';
import { getHomeRouteForRole } from '@/lib/routes.utils';

export const LoginPage = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={getHomeRouteForRole(user.role)} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-6 rounded-lg bg-background p-8 shadow-md border border-border">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">HelpDesk Lite</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your support workspace
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
