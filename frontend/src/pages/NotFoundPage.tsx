import React from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-4 flex-col gap-4">
      <EmptyState
        title="404 - Page Not Found"
        description="The page you are looking for doesn't exist or has been moved."
      />
      <Button onClick={() => navigate('/')}>Go Home</Button>
    </div>
  );
};
