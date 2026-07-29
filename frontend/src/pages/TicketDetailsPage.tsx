import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ticketsApi } from '@/features/tickets/api/tickets.api';
import type { Ticket, TicketStatus } from '@/types/ticket';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { StatusChangeControl } from '@/components/tickets/StatusChangeControl';
import { AssignOwnerControl } from '@/components/tickets/AssignOwnerControl';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  UserCheck,
  Tag,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTicket = async () => {
    if (!id) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await ticketsApi.getTicketById(id);
      if (response.success && response.data) {
        setTicket(response.data);
      } else {
        setErrorMsg('Ticket not found.');
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        navigate('/login', { replace: true });
        return;
      }
      setErrorMsg(
        err?.response?.data?.message || 'We could not fetch ticket details. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleUpdateStatus = async (nextStatus: TicketStatus) => {
    if (!id || !ticket) return;
    const response = await ticketsApi.updateTicketStatus(id, nextStatus);
    if (response.success && response.data) {
      setTicket(response.data);
    }
  };

  const handleAssignOwner = async (ownerId: string) => {
    if (!id || !ticket) return;
    const response = await ticketsApi.assignOwner(id, ownerId);
    if (response.success && response.data) {
      setTicket(response.data);
    }
  };

  const getBackPath = () => {
    if (currentUser?.role === 'staff') return '/staff/tickets';
    if (currentUser?.role === 'manager') return '/manager/queue';
    return '/my-requests';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={getBackPath()}
          className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requests List</span>
        </Link>
        <Button
          variant="outline"
          onClick={fetchTicket}
          disabled={isLoading}
          className="border-slate-700 text-slate-400 hover:text-slate-200 text-xs py-1 px-3"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <LoadingState message="Fetching ticket details..." />
      ) : errorMsg || !ticket ? (
        <Card className="text-center py-12 space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <p className="text-sm text-slate-300 font-medium">{errorMsg || 'Ticket not found.'}</p>
          <Button onClick={() => navigate(getBackPath())} variant="outline" className="text-xs">
            Return to Dashboard
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Main Card */}
          <Card className="space-y-6">
            {/* Header / Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-indigo-400">
                    #{ticket._id.slice(-6).toUpperCase()}
                  </span>
                  <Badge status={ticket.status} className="text-xs px-2.5 py-0.5" />
                </div>
                <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
                  {ticket.category} Request
                </h1>
              </div>

              {/* Action Controls Section (Only Staff / Manager) */}
              {currentUser && currentUser.role !== 'requester' && (
                <div className="flex flex-wrap items-center gap-3 bg-[#161f30] p-3 rounded-md border border-slate-800">
                  <StatusChangeControl
                    currentStatus={ticket.status}
                    onUpdateStatus={handleUpdateStatus}
                  />
                  <AssignOwnerControl
                    currentOwner={ticket.owner}
                    onAssignOwner={handleAssignOwner}
                  />
                </div>
              )}
            </div>

            {/* Core Ticket Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#161f30] p-4 rounded-md border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Tag className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Category:</span>
                <span className="font-medium text-slate-200">{ticket.category}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Requester:</span>
                <span className="font-medium text-slate-200">
                  {ticket.requester?.name || 'Unknown'} ({ticket.requester?.email || 'N/A'})
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Assigned Owner:</span>
                <span
                  className={`font-medium ${
                    ticket.owner ? 'text-indigo-300' : 'text-slate-500 italic'
                  }`}
                >
                  {ticket.owner ? `${ticket.owner.name} (${ticket.owner.email})` : 'Unassigned'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Submitted:</span>
                <span className="font-medium text-slate-200">
                  {new Date(ticket.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Last Updated:</span>
                <span className="font-medium text-slate-200">
                  {new Date(ticket.updatedAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Full Problem Description
              </h2>
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TicketDetailsPage;
