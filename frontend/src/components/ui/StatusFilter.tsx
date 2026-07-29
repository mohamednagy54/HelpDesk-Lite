import React from 'react';
import { cn } from '@/lib/utils';

export type TicketStatusFilter = 'All' | 'New' | 'In Progress' | 'Resolved' | 'Closed';

interface StatusFilterProps {
  currentStatus: TicketStatusFilter;
  onStatusChange: (status: TicketStatusFilter) => void;
  className?: string;
}

const statuses: TicketStatusFilter[] = ['All', 'New', 'In Progress', 'Resolved', 'Closed'];

export const StatusFilter: React.FC<StatusFilterProps> = ({ currentStatus, onStatusChange, className }) => {
  return (
    <div className={cn("inline-flex space-x-1 rounded-lg bg-slate-900 p-1 border border-slate-800", className)}>
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onStatusChange(status)}
          className={cn(
            "flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            currentStatus === status
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          )}
        >
          {status}
        </button>
      ))}
    </div>
  );
};
