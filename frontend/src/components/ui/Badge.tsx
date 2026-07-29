import React from 'react';
import { cn } from '@/lib/utils';
import type { TicketStatus } from '@/types/ticket';

// Single source of truth for status colors — consumed by Badge AND StatusSummaryCard
export const STATUS_STYLES: Record<TicketStatus, { badge: string; text: string; bg: string }> = {
  'New':         { badge: 'bg-[#0f2942] text-[#38bdf8] border-[#1e40af]/40',    text: 'text-[#38bdf8]', bg: 'bg-[#0f2942] border-[#1e40af]/40' },
  'In Progress': { badge: 'bg-[#2e210d] text-[#fbbf24] border-[#b45309]/40',    text: 'text-[#fbbf24]', bg: 'bg-[#2e210d] border-[#b45309]/40' },
  'Resolved':    { badge: 'bg-[#0d2818] text-[#34d399] border-[#065f46]/40',    text: 'text-[#34d399]', bg: 'bg-[#0d2818] border-[#065f46]/40' },
  'Closed':      { badge: 'bg-[#181d28] text-[#94a3b8] border-[#334155]/40',    text: 'text-[#94a3b8]', bg: 'bg-[#181d28] border-[#334155]/40' },
};

const ROLE_STYLES: Record<string, string> = {
  manager:   'bg-purple-950/60 text-purple-300 border-purple-800/40',
  staff:     'bg-indigo-950/60 text-indigo-300 border-indigo-800/40',
  requester: 'bg-slate-900 text-slate-300 border-slate-800',
};

export interface BadgeProps {
  status?: TicketStatus | string;
  role?: string;
  variant?: string;   // kept for backwards compat — not used for styling
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ status, role, className, children }) => {
  let styles = 'bg-slate-900 text-slate-300 border-slate-800';

  if (status && Object.prototype.hasOwnProperty.call(STATUS_STYLES, status)) {
    styles = STATUS_STYLES[status as TicketStatus].badge;
  } else if (role && ROLE_STYLES[role]) {
    styles = ROLE_STYLES[role];
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border transition-colors duration-300',
        styles,
        className
      )}
    >
      {children || status || role}
    </span>
  );
};
