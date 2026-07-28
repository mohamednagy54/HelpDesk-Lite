import React from 'react';
import { FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({ title, description, className, icon }: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        {icon || <FileQuestion className="h-10 w-10" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-2 max-w-sm">{description}</p>}
    </div>
  );
};
