import React from 'react';
import { useParams } from 'react-router-dom';

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Ticket Details</h1>
        <p className="text-sm text-muted-foreground">Viewing Ticket ID: #{id}</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Ticket details content placeholder. Detailed view for ticket #{id}.
        </p>
      </div>
    </div>
  );
};
