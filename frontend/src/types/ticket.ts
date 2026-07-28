export type TicketCategory = 'Hardware' | 'Software' | 'Access' | 'Other';

export type TicketStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';

export interface TicketUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
}

export interface Ticket {
  _id?: string;
  id: string;
  category: TicketCategory;
  description: string;
  status: TicketStatus;
  requester?: TicketUser | string;
  owner?: TicketUser | null;
  created_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTicketPayload {
  category: TicketCategory;
  description: string;
}

export interface TicketApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
