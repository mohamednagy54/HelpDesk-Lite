import React from 'react';
import { cn } from '@/lib/utils';
import type { TicketStatus } from '@/types/ticket';

// Single source of truth for status colors — consumed by Badge AND StatusSummaryCard
export const STATUS_STYLES: Record<TicketStatus, { badge: string; text: string; bg: string }> = {
  'New':         { badge: 'bg-sky-950/50 text-sky-400 border-sky-500/30',          text: 'text-sky-400',     bg: 'bg-sky-950/50 border-sky-500/30' },
  'In Progress': { badge: 'bg-amber-950/50 text-amber-400 border-amber-500/30',    text: 'text-amber-400',   bg: 'bg-amber-950/50 border-amber-500/30' },
  'Resolved':    { badge: 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-950/50 border-emerald-500/30' },
  'Closed':      { badge: 'bg-slate-900 text-slate-400 border-slate-700/60',       text: 'text-slate-400',   bg: 'bg-slate-900 border-slate-700/60' },
};

const ROLE_STYLES: Record<string, string> = {
  manager:   'bg-purple-950/50 text-purple-400 border-purple-500/30',
  staff:     'bg-indigo-950/50 text-indigo-400 border-indigo-500/30',
  requester: 'bg-slate-800 text-slate-300 border-slate-700',
};

export interface BadgeProps {
  status?: TicketStatus | string;
  role?: string;
  variant?: string;   // kept for backwards compat — not used for styling
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ status, role, className, children }) => {
  let styles = 'bg-slate-800 text-slate-300 border-slate-700';

  if (status && Object.prototype.hasOwnProperty.call(STATUS_STYLES, status)) {
    styles = STATUS_STYLES[status as TicketStatus].badge;
  } else if (role && ROLE_STYLES[role]) {
    styles = ROLE_STYLES[role];
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-300',
        styles,
        className
      )}
    >
      {children || status || role}
    </span>
  );
};
