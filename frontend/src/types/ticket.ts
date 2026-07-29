export type TicketStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';

export type TicketCategory = 'Access' | 'Software' | 'Hardware' | 'Other';

export interface UserRef {
  _id: string;
  name: string;
  email: string;
}

export interface Ticket {
  _id: string;
  category: TicketCategory;
  description: string;
  status: TicketStatus;
  requester: UserRef;
  owner?: UserRef | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketInput {
  category: TicketCategory;
  description: string;
}

export interface UpdateStatusInput {
  status: TicketStatus;
}

export interface AssignOwnerInput {
  ownerId: string;
}
