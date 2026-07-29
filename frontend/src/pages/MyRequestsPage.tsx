import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText } from 'lucide-react';

export const MyRequestsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Requests</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage support tickets you have submitted.
          </p>
        </div>
        <Button asChild>
          <Link to="/new-ticket">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Ticket
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">No requests found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You haven't submitted any support requests yet.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Sample Badge:</span>
          <Badge status="New" />
          <Badge status="In Progress" />
          <Badge status="Resolved" />
        </div>
      </div>
    </div>
  );
};
