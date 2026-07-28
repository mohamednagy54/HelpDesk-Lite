import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAllTickets } from '@/api/tickets';
import { StatusFilter, TicketStatusFilter } from '@/components/ui/StatusFilter';
import { Badge, BadgeProps } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { TicketStatusType } from '@/types/ticket';

export const getStatusVariant = (status: TicketStatusType): BadgeProps["variant"] => {
  switch (status) {
    case 'New': return 'default';
    case 'In Progress': return 'secondary';
    case 'Resolved': return 'success';
    case 'Closed': return 'outline';
    default: return 'default';
  }
};

export const StaffTickets: React.FC = () => {
  const [filter, setFilter] = useState<TicketStatusFilter>('All');
  
  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ['staffTickets', filter],
    queryFn: () => getAllTickets(filter),
  });

  const sortedTickets = useMemo(() => {
    if (!tickets) return [];
    return [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold tracking-tight">All Tickets</h1>
        <StatusFilter currentStatus={filter} onStatusChange={setFilter} />
      </div>

      <div className="rounded-md border bg-card">
        {isLoading ? (
          <LoadingState text="Loading tickets..." />
        ) : error ? (
          <EmptyState 
            title="Failed to load tickets" 
            description="There was a problem fetching the tickets. Please try again." 
          />
        ) : sortedTickets.length === 0 ? (
          <EmptyState 
            title="No tickets found" 
            description="No tickets match this filter." 
          />
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Requester</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Owner</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {sortedTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{ticket.id}</td>
                    <td className="p-4 align-middle">{ticket.requesterName}</td>
                    <td className="p-4 align-middle">{ticket.category}</td>
                    <td className="p-4 align-middle">
                      <Badge variant={getStatusVariant(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {ticket.ownerName || "Unassigned"}
                    </td>
                    <td className="p-4 align-middle text-right text-muted-foreground whitespace-nowrap">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/tickets/${ticket.id}`}>Open</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
