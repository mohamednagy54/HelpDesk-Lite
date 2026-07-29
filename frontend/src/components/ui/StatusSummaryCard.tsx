import React from 'react';
import { cn } from '@/lib/utils';
import { STATUS_STYLES } from './Badge';
import type { TicketStatus } from '@/types/ticket';

interface StatusSummaryCardProps {
  title: string;
  count: number;
  status: TicketStatus;
  className?: string;
}

export const StatusSummaryCard: React.FC<StatusSummaryCardProps> = ({ title, count, status, className }) => {
  const { text, bg } = STATUS_STYLES[status];

  return (
    <div className={cn('rounded-md border p-4 flex flex-col justify-between gap-1.5', bg, className)}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{title}</p>
      <p className={cn('text-2xl font-semibold tabular-nums tracking-tight', text)}>{count}</p>
    </div>
  );
};
