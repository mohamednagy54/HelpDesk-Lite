import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAllTickets } from '@/api/tickets';
import { StatusFilter, TicketStatusFilter } from '@/components/ui/StatusFilter';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import type { Ticket } from '@/types/ticket';
import { ArrowDownIcon } from 'lucide-react';

const getTicketId = (ticket: Ticket): string => ticket._id || ticket.id || '';

const getRequesterName = (ticket: Ticket): string => {
  if (typeof ticket.requester === 'object' && ticket.requester !== null) {
    return ticket.requester.name;
  }
  return 'Unknown';
};

const getOwnerName = (ticket: Ticket): string => {
  if (!ticket.owner) return 'Unassigned';
  if (typeof ticket.owner === 'object' && ticket.owner !== null) {
    return ticket.owner.name;
  }
  return 'Unassigned';
};

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export const StaffTickets: React.FC = () => {
  const [filter, setFilter] = useState<TicketStatusFilter>('All');

  const { data: rawTickets, isLoading, error } = useQuery({
    queryKey: ['staffTickets', filter],
    queryFn: () => getAllTickets(filter),
  });

  // Newest first — client-side sort on the fetched data
  const sortedTickets = useMemo(() => {
    if (!rawTickets) return [];
    return [...rawTickets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [rawTickets]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">All Tickets</h1>
          <p className="text-sm text-slate-400 mt-1">All support tickets in the system</p>
        </div>
        <StatusFilter currentStatus={filter} onStatusChange={setFilter} />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
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
              <thead className="border-b border-slate-800 bg-slate-950/60">
                <tr>
                  <th className="h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-slate-400 w-[100px]">ID</th>
                  <th className="h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-slate-400">Requester</th>
                  <th className="h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-slate-400">Category</th>
                  <th className="h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-slate-400">Owner</th>
                  <th className="h-11 px-4 text-right align-middle text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span className="inline-flex items-center justify-end gap-1">
                      Date
                      <ArrowDownIcon className="h-3 w-3 text-indigo-400" aria-label="Sorted newest first" />
                    </span>
                  </th>
                  <th className="h-11 px-4 text-right align-middle text-xs font-semibold uppercase tracking-wider text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedTickets.map((ticket) => {
                  const ticketId = getTicketId(ticket);
                  return (
                    <tr key={ticketId} className="transition-colors hover:bg-slate-800/40">
                      <td className="p-4 align-middle font-mono text-xs font-semibold text-indigo-400">
                        #{ticketId.slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4 align-middle text-slate-200">{getRequesterName(ticket)}</td>
                      <td className="p-4 align-middle text-slate-300">{ticket.category}</td>
                      <td className="p-4 align-middle">
                        <Badge status={ticket.status} />
                      </td>
                      <td className="p-4 align-middle text-slate-400">{getOwnerName(ticket)}</td>
                      <td className="p-4 align-middle text-right text-slate-400 whitespace-nowrap tabular-nums">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/tickets/${ticketId}`}>Open</Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
