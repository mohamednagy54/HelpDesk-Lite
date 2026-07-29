import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { cn } from '@/lib/utils';
import {
  FileText,
  PlusCircle,
  Ticket,
  LayoutDashboard,
  BarChart3,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SidebarItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const Sidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const navItemsByRole: Record<string, SidebarItem[]> = {
    requester: [
      { label: 'My Requests', to: '/my-requests', icon: FileText },
      { label: 'New Ticket', to: '/new-ticket', icon: PlusCircle },
    ],
    staff: [
      { label: 'All Tickets', to: '/staff/tickets', icon: Ticket },
      { label: 'My Requests', to: '/my-requests', icon: FileText },
    ],
    manager: [
      { label: 'Queue', to: '/manager/queue', icon: LayoutDashboard },
      { label: 'Status Summary', to: '/manager/summary', icon: BarChart3 },
    ],
  };

  const navItems = navItemsByRole[user.role] || [];

  return (
    <aside className="w-56 flex-shrink-0 border-r border-border bg-background/50 min-h-[calc(100vh-3.5rem)] p-4">
      <div className="space-y-1">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Navigation
        </p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                    isActive &&
                      'bg-accent text-accent-foreground font-semibold border-l-2 border-primary rounded-l-none'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
