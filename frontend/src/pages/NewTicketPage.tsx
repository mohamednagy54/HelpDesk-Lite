import React from 'react';

export const NewTicketPage: React.FC = () => {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Support Ticket</h1>
        <p className="text-sm text-muted-foreground">
          Submit a new issue or request for assistance.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          New Ticket form placeholder shell. Form components will render here.
        </p>
      </div>
    </div>
  );
};
