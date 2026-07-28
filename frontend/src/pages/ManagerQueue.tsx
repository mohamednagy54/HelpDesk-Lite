import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAllTickets, getTicketSummary } from '@/api/tickets';
import { StatusSummaryCard } from '@/components/ui/StatusSummaryCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { getStatusVariant } from './StaffTickets';

export const ManagerQueue: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['ticketSummary'],
    queryFn: getTicketSummary,
  });

  const { data: tickets, isLoading: isLoadingTickets, error } = useQuery({
    queryKey: ['managerTickets', showAll],
    queryFn: () => getAllTickets(showAll ? 'All' : 'open'),
  });

  const sortedTickets = useMemo(() => {
    if (!tickets) return [];
    return [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets]);

  const isLoading = isLoadingSummary || isLoadingTickets;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Manager Queue</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatusSummaryCard 
          title="New" 
          count={summary?.new || 0} 
          variant={getStatusVariant('New')}
        />
        <StatusSummaryCard 
          title="In Progress" 
          count={summary?.inProgress || 0} 
          variant={getStatusVariant('In Progress')}
        />
        <StatusSummaryCard 
          title="Resolved" 
          count={summary?.resolved || 0} 
          variant={getStatusVariant('Resolved')}
        />
        <StatusSummaryCard 
          title="Closed" 
          count={summary?.closed || 0} 
          variant={getStatusVariant('Closed')}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold tracking-tight">
          {showAll ? 'All Tickets' : 'Open Tickets'}
        </h2>
        <Button 
          variant="outline" 
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Open Only' : 'Show All Tickets'}
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        {isLoading ? (
          <LoadingState text="Loading queue..." />
        ) : error ? (
          <EmptyState 
            title="Failed to load tickets" 
            description="There was a problem fetching the queue. Please try again." 
          />
        ) : sortedTickets.length === 0 ? (
          <EmptyState 
            title="No tickets found" 
            description={showAll ? "There are no tickets in the system." : "There are no open tickets."} 
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
