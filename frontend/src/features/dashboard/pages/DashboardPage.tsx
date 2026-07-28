import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['ticket-summary'],
    queryFn: dashboardApi.getSummary,
    enabled: user?.role === 'manager',
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {user?.role !== 'manager' ? (
        <EmptyState 
          title="Limited Access" 
          description="Only managers can see the dashboard summary." 
        />
      ) : isLoading ? (
        <div className="flex h-64 items-center justify-center border rounded-lg">
          <Loader className="h-8 w-8" />
        </div>
      ) : isError ? (
        <div className="flex h-64 items-center justify-center border rounded-lg bg-destructive/10 text-destructive">
          Failed to load summary.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(data?.data || {}).map(([status, count]) => (
            <div key={status} className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">{status} Tickets</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{count as number}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
