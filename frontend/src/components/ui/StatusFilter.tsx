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
    <div className={cn("inline-flex space-x-1 rounded-lg bg-muted p-1", className)}>
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onStatusChange(status)}
          className={cn(
            "flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            currentStatus === status
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted-foreground/10"
          )}
        >
          {status}
        </button>
      ))}
    </div>
  );
};
