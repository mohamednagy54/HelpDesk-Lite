import React from 'react';
import { Badge } from '@/components/ui/Badge';

export const StaffTicketsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">All Tickets Queue</h1>
        <p className="text-sm text-muted-foreground">
          Review, assign, and update active tickets assigned to support staff.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Staff View Active Badges:</span>
          <Badge status="New" />
          <Badge status="In Progress" />
          <Badge status="Resolved" />
        </div>
        <p className="text-sm text-muted-foreground">
          Staff tickets queue table shell.
        </p>
      </div>
    </div>
  );
};
