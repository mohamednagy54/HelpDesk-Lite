export type TicketStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';
// Keep legacy alias for any files still using the old name
export type TicketStatusType = TicketStatus;

export interface Ticket {
  _id: string;
  id?: string; // some API shapes may include this
  description: string;
  category: string;
  status: TicketStatus;
  requester: { _id: string; name: string; email: string } | string;
  owner: { _id: string; name: string; email: string } | string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketSummary {
  new: number;
  inProgress: number;
  resolved: number;
  closed: number;
}
