import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LogOut, LifeBuoy } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            HelpDesk Lite
          </span>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {user.name}
              </span>
              <Badge role={user.role} />
            </div>

            <div className="h-4 w-px bg-border" aria-hidden="true" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
