import React, { useState } from 'react';
import type { UserRef } from '@/types/ticket';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Loader2, UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AssignOwnerControlProps {
  currentOwner?: UserRef | null;
  onAssignOwner: (ownerId: string) => Promise<void>;
}

export const AssignOwnerControl: React.FC<AssignOwnerControlProps> = ({
  currentOwner,
  onAssignOwner,
}) => {
  const user = useAuthStore((state) => state.user);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!user || user.role === 'requester') {
    return null; // Requesters cannot assign owners
  }

  const isAssignedToMe = currentOwner?._id === user._id;

  const handleAssignToMe = async () => {
    if (isAssignedToMe) return;
    setErrorMsg(null);
    setIsUpdating(true);
    try {
      await onAssignOwner(user._id);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Could not update assignment. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {isAssignedToMe ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-3 py-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
            <Check className="w-3.5 h-3.5" />
            <span>Assigned to you</span>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handleAssignToMe}
            disabled={isUpdating}
            className="text-xs font-medium border-slate-700 hover:border-slate-600 text-slate-200 px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentOwner ? 'Reassign to me' : 'Assign to me'}</span>
              </>
            )}
          </Button>
        )}
      </div>
      {errorMsg && (
        <p className="text-xs text-red-400 font-medium animate-fadeIn">{errorMsg}</p>
      )}
    </div>
  );
};
