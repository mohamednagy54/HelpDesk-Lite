import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeRole = 'requester' | 'staff' | 'manager';
export type BadgeStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  role?: BadgeRole;
  status?: BadgeStatus;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  role,
  status,
  children,
  ...props
}) => {
  let roleStyles = '';
  let roleLabel = '';

  if (role) {
    switch (role) {
      case 'requester':
        roleStyles = 'bg-slate-100 text-slate-700 border-slate-200';
        roleLabel = 'Requester';
        break;
      case 'staff':
        roleStyles = 'bg-blue-50 text-blue-700 border-blue-200';
        roleLabel = 'Staff';
        break;
      case 'manager':
        roleStyles = 'bg-purple-50 text-purple-700 border-purple-200';
        roleLabel = 'Manager';
        break;
    }
  }

  let statusStyles = '';
  let statusLabel = '';

  if (status) {
    switch (status) {
      case 'New':
        statusStyles = 'bg-blue-50 text-blue-700 border-blue-200';
        statusLabel = 'New';
        break;
      case 'In Progress':
        statusStyles = 'bg-amber-50 text-amber-700 border-amber-200';
        statusLabel = 'In Progress';
        break;
      case 'Resolved':
        statusStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        statusLabel = 'Resolved';
        break;
      case 'Closed':
        statusStyles = 'bg-slate-100 text-slate-600 border-slate-200';
        statusLabel = 'Closed';
        break;
    }
  }

  let variantStyles = 'bg-secondary text-secondary-foreground border-transparent';
  if (variant === 'default') variantStyles = 'bg-primary/10 text-primary border-primary/20';
  if (variant === 'outline') variantStyles = 'border-border text-foreground bg-transparent';
  if (variant === 'destructive') variantStyles = 'bg-destructive/10 text-destructive border-destructive/20';

  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const appliedStyles = roleStyles || statusStyles || variantStyles;
  const content = children || roleLabel || statusLabel;

  return (
    <span className={cn(baseStyles, appliedStyles, className)} {...props}>
      {content}
    </span>
  );
};
