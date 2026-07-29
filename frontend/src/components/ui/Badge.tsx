import React from 'react';
import { cn } from '@/lib/utils';
import type { TicketStatus } from '@/types/ticket';

interface BadgeProps {
  status?: TicketStatus | string;
  role?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ status, role, className, children }) => {
  const getBadgeStyle = () => {
    if (status) {
      switch (status) {
        case 'New':
          return 'bg-sky-950/50 text-sky-400 border-sky-500/30';
        case 'In Progress':
          return 'bg-amber-950/50 text-amber-400 border-amber-500/30';
        case 'Resolved':
          return 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30';
        case 'Closed':
          return 'bg-slate-900 text-slate-400 border-slate-700/60';
        default:
          return 'bg-slate-800 text-slate-300 border-slate-700';
      }
    }

    if (role) {
      switch (role) {
        case 'manager':
          return 'bg-purple-950/50 text-purple-400 border-purple-500/30';
        case 'staff':
          return 'bg-indigo-950/50 text-indigo-400 border-indigo-500/30';
        case 'requester':
        default:
          return 'bg-slate-800 text-slate-300 border-slate-700';
      }
    }

    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        getBadgeStyle(),
        className
      )}
    >
      {children || status || role}
    </span>
  );
};
