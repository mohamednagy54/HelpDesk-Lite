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
    <div className={cn('rounded-xl border p-5 flex flex-col gap-2', bg, className)}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
      <p className={cn('text-4xl font-bold tabular-nums', text)}>{count}</p>
    </div>
  );
};
