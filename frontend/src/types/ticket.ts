export type TicketStatusType = 'New' | 'In Progress' | 'Resolved' | 'Closed';

export interface Ticket {
  id: string;
  requesterName: string;
  category: string;
  status: TicketStatusType;
  ownerName: string | null;
  createdAt: string;
}

export interface TicketSummary {
  new: number;
  inProgress: number;
  resolved: number;
  closed: number;
}
