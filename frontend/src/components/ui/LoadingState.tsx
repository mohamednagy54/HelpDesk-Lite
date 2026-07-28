import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LoadingState = ({ className, text = "Loading..." }: { className?: string, text?: string }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center text-muted-foreground", className)}>
      <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
};
