import React from 'react';
import { useRouteError } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { AlertCircle } from 'lucide-react';

export const ErrorPage = () => {
  const error: any = useRouteError();
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        icon={<AlertCircle className="h-10 w-10 text-destructive" />}
        title="Oops! Something went wrong"
        description={error?.statusText || error?.message || "An unexpected error occurred."}
      />
    </div>
  );
};
