import React, { useState } from 'react';
import type { TicketStatus } from '@/types/ticket';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';

interface StatusChangeControlProps {
  currentStatus: TicketStatus;
  onUpdateStatus: (nextStatus: TicketStatus) => Promise<void>;
}

export const StatusChangeControl: React.FC<StatusChangeControlProps> = ({
  currentStatus,
  onUpdateStatus,
}) => {
  const user = useAuthStore((state) => state.user);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!user || user.role === 'requester') {
    return null; // Requesters are read-only
  }

  // Determine allowed next status
  const getNextStatus = (): TicketStatus | null => {
    switch (currentStatus) {
      case 'New':
        return 'In Progress';
      case 'In Progress':
        return 'Resolved';
      case 'Resolved':
        return user.role === 'manager' ? 'Closed' : null;
      case 'Closed':
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

  const handleStatusChange = async () => {
    if (!nextStatus) return;
    setErrorMsg(null);
    setIsUpdating(true);
    try {
      await onUpdateStatus(nextStatus);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        `Could not update status from ${currentStatus} to ${nextStatus}. Please try again.`;
      setErrorMsg(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!nextStatus) {
    return (
      <div className="text-xs text-slate-400 font-medium italic">
        {currentStatus === 'Closed'
          ? 'Ticket is closed (Final state).'
          : 'No further status transitions available for your role.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={handleStatusChange}
          disabled={isUpdating}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
        >
          {isUpdating ? (
            <>
              <Loader size="sm" className="text-white" />
              Updating...
            </>
          ) : (
            <>
              <span>Move to {nextStatus}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </div>
      {errorMsg && (
        <p className="text-xs text-red-400 font-medium animate-fadeIn">{errorMsg}</p>
      )}
    </div>
  );
};
