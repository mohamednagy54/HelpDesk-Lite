import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
