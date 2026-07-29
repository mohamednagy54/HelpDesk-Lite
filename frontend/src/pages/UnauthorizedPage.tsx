import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { getHomeRouteForRole } from '@/lib/routes.utils';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const homeRoute = getHomeRouteForRole(user?.role);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Access Denied
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        You don't have access to this page with your current role (
        <span className="font-semibold capitalize text-foreground">{user?.role || 'Guest'}</span>
        ).
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          to={homeRoute}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to My Workspace
        </Link>
      </div>
    </div>
  );
};
