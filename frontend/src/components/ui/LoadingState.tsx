import React from 'react';
import { Loader } from '@/components/ui/Loader';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading details...',
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-slate-400 gap-4', className)}>
      <Loader size="lg" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
