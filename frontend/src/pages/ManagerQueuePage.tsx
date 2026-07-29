import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ticketsApi } from '@/features/tickets/api/tickets.api';
import type { Ticket } from '@/types/ticket';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Eye, RefreshCw, Filter, ShieldAlert } from 'lucide-react';

export const ManagerQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ticketsApi.getAllTickets();
      if (response.success && Array.isArray(response.data)) {
        setTickets(response.data);
      } else {
        setError('Failed to fetch manager ticket queue.');
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        navigate('/login', { replace: true });
        return;
      }
      setError(err?.response?.data?.message || 'We couldn\'t load the ticket queue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter === 'all') return true;
    return ticket.status === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">Manager Ticket Queue</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Global management view: Assign staff, manage ticket lifecycle, and oversee queue
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTickets}
            disabled={isLoading}
            className="flex items-center gap-1.5 border-slate-800 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111827] border border-slate-800 rounded-md p-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-medium text-slate-300">Filter by Status:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'New', 'In Progress', 'Resolved', 'Closed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {status === 'all' ? 'All Tickets' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <Card className="p-12">
          <LoadingState message="Fetching global ticket queue..." />
        </Card>
      ) : error ? (
        <Card className="p-8 text-center border-red-950/40 bg-red-950/10">
          <p className="text-red-400 mb-4 text-xs font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchTickets}>
            Try Again
          </Button>
        </Card>
      ) : filteredTickets.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={<ShieldAlert className="h-8 w-8 text-slate-400" />}
            title="Queue Empty"
            description={
              statusFilter === 'all'
                ? 'No tickets found in the system.'
                : `No tickets found matching status "${statusFilter}".`
            }
          />
        </Card>
      ) : (
        <div className="bg-[#111827] border border-slate-800 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#161f30] text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="px-6 py-4 font-semibold">Ticket ID</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Requester</th>
                  <th className="px-6 py-4 font-semibold">Assigned To</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTickets.map((ticket, index) => {
                  const ticketIdDisplay = ticket._id
                    ? `#${ticket._id.slice(-6).toUpperCase()}`
                    : ticket.id
                    ? `#${ticket.id.slice(-6).toUpperCase()}`
                    : '#TICKET';

                  const formattedDate = ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A';

                  const requesterName = typeof ticket.requester === 'object' && ticket.requester?.name
                    ? ticket.requester.name
                    : 'Requester';

                  const ownerName = typeof ticket.owner === 'object' && ticket.owner?.name
                    ? ticket.owner.name
                    : 'Unassigned';

                  return (
                    <tr
                      key={ticket._id || ticket.id}
                      className="hover:bg-slate-800/40 transition-colors group animate-fade-in-up"
                      style={{ animationDelay: `${Math.min(index, 5) * 30}ms` }}
                    >
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-indigo-400">
                        {ticketIdDisplay}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-200">
                        {ticket.category}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {requesterName}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        <span className={ownerName === 'Unassigned' ? 'text-amber-400/80 italic' : 'text-slate-300 font-medium'}>
                          {ownerName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/tickets/${ticket._id || ticket.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-300 hover:text-indigo-400 hover:bg-slate-800"
                          >
                            <Eye className="h-4 w-4 mr-1.5" />
                            Manage
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
