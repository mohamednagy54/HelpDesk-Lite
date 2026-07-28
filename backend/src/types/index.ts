export type UserRole = 'requester' | 'staff' | 'manager';
export type TicketCategory = 'Hardware' | 'Software' | 'Access' | 'Other';
export type TicketStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}
