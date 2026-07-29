import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAllTickets, getTicketSummary } from '@/api/tickets';
import { StatusSummaryCard } from '@/components/ui/StatusSummaryCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import type { Ticket } from '@/types/ticket';

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

export const ManagerQueue: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['ticketSummary'],
    queryFn: getTicketSummary,
  });

  const { data: rawTickets, isLoading: isLoadingTickets, error } = useQuery({
    queryKey: ['managerTickets', showAll],
    queryFn: () => getAllTickets(showAll ? 'All' : 'open'),
  });

  const sortedTickets = useMemo(() => {
    if (!rawTickets) return [];
    return [...rawTickets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [rawTickets]);

  const isLoading = isLoadingSummary || isLoadingTickets;

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-100">Manager Queue</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          High-level overview of support tickets, workloads, and team assignments.
        </p>
      </div>

      {/* Status Summary Widget */}
      <section aria-label="Ticket status summary">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">Status Summary</h2>
        {isLoadingSummary ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['New', 'In Progress', 'Resolved', 'Closed'].map((s) => (
              <div key={s} className="h-20 rounded-md border border-slate-800 bg-[#111827] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatusSummaryCard title="New"         count={summary?.new ?? 0}        status="New" />
            <StatusSummaryCard title="In Progress" count={summary?.inProgress ?? 0} status="In Progress" />
            <StatusSummaryCard title="Resolved"    count={summary?.resolved ?? 0}   status="Resolved" />
            <StatusSummaryCard title="Closed"      count={summary?.closed ?? 0}     status="Closed" />
          </div>
        )}
      </section>

      {/* Ticket Table */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
          <h2 className="text-sm font-semibold text-slate-200">
            {showAll ? 'All Tickets' : 'Open Tickets'}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs"
          >
            {showAll ? 'Show open only' : 'Show all tickets'}
          </Button>
        </div>

        <div className="rounded-md border border-slate-800 bg-[#111827] overflow-hidden">
          {isLoadingTickets ? (
            <LoadingState message="Loading queue..." />
          ) : error ? (
            <EmptyState
              title="Failed to load tickets"
              description="There was a problem fetching the queue. Please try again."
            />
          ) : sortedTickets.length === 0 ? (
            <EmptyState
              title="No tickets found"
              description={showAll ? 'There are no tickets in the system.' : 'There are no open tickets.'}
            />
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm border-collapse">
                <thead className="border-b border-slate-800 bg-[#161f30]">
                  <tr>
                    <th className="h-10 px-4 text-left align-middle text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-[100px]">ID</th>
                    <th className="h-10 px-4 text-left align-middle text-[11px] font-semibold uppercase tracking-wider text-slate-400">Requester</th>
                    <th className="h-10 px-4 text-left align-middle text-[11px] font-semibold uppercase tracking-wider text-slate-400">Category</th>
                    <th className="h-10 px-4 text-left align-middle text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="h-10 px-4 text-left align-middle text-[11px] font-semibold uppercase tracking-wider text-slate-400">Owner</th>
                    <th className="h-10 px-4 text-right align-middle text-[11px] font-semibold uppercase tracking-wider text-slate-400">Date</th>
                    <th className="h-10 px-4 text-right align-middle text-[11px] font-semibold uppercase tracking-wider text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sortedTickets.map((ticket, index) => {
                    const ticketId = getTicketId(ticket);
                    return (
                      <tr
                        key={ticketId}
                        className="transition-colors hover:bg-slate-800/40 animate-fade-in-up"
                        style={{ animationDelay: `${Math.min(index, 5) * 30}ms` }}
                      >
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
      </section>
    </div>
  );
};
