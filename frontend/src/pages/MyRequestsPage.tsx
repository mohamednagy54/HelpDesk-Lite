import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ticketsApi } from '@/features/tickets/api/tickets.api';
import type { Ticket, TicketStatus } from '@/types/ticket';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Eye, RefreshCw, Filter } from 'lucide-react';

export const MyRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ticketsApi.getMyTickets();
      if (response.success && Array.isArray(response.data)) {
        setTickets(response.data);
      } else {
        setError('Failed to fetch requests.');
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        navigate('/login', { replace: true });
        return;
      }
      setError(err?.response?.data?.message || 'We couldn\'t load your requests. Please try again.');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">My Requests</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage your submitted support tickets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchTickets}
            disabled={isLoading}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs py-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link to="/new-ticket">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2 px-4 shadow-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>New Ticket</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <LoadingState message="Loading your requests..." />
      ) : error ? (
        <Card className="text-center py-12 space-y-4">
          <p className="text-sm text-red-400 font-medium">{error}</p>
          <Button onClick={fetchTickets} variant="outline" className="text-xs">
            Try Again
          </Button>
        </Card>
      ) : tickets.length === 0 ? (
        <Card className="py-16">
          <EmptyState
            title="You haven't submitted any requests yet"
            description="When you need help with access, software, or hardware, submit a ticket and track its status here."
            actionLabel="Submit a new request"
            onAction={() => navigate('/new-ticket')}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter by Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Statuses ({tickets.length})</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <span className="text-xs text-slate-500">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </span>
          </div>

          {/* Table Container */}
          <Card className="p-0 overflow-hidden border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-28">Ticket ID</th>
                    <th className="py-3.5 px-4 w-32">Category</th>
                    <th className="py-3.5 px-4">Short Description</th>
                    <th className="py-3.5 px-4 w-32">Status</th>
                    <th className="py-3.5 px-4 w-36">Submitted</th>
                    <th className="py-3.5 px-4 w-28 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                        No tickets match the selected status filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket, index) => (
                      <tr
                        key={ticket._id}
                        className="hover:bg-slate-800/40 transition-colors group animate-fade-in-up"
                        style={{ animationDelay: `${Math.min(index, 5) * 30}ms`, opacity: 0 }}
                      >
                        <td className="py-3.5 px-4 font-mono text-xs font-medium text-slate-400 group-hover:text-indigo-400">
                          #{ticket._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-200">
                          {ticket.category}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                          <p className="truncate text-slate-300 text-xs md:text-sm">
                            {ticket.description}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge status={ticket.status as TicketStatus} />
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                          {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link to={`/tickets/${ticket._id}`}>
                            <Button
                              variant="outline"
                              className="text-xs px-2.5 py-1 border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyRequestsPage;
