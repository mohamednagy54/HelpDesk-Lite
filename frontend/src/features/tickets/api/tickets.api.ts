import { api } from '@/lib/axios';
import type {
  Ticket,
  CreateTicketInput,
  TicketStatus,
} from '@/types/ticket';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const ticketsApi = {
  getMyTickets: async (): Promise<ApiResponse<Ticket[]>> => {
    const { data } = await api.get<ApiResponse<Ticket[]>>('/tickets/mine');
    return data;
  },

  createTicket: async (payload: CreateTicketInput): Promise<ApiResponse<Ticket>> => {
    const { data } = await api.post<ApiResponse<Ticket>>('/tickets', payload);
    return data;
  },

  getTicketById: async (id: string): Promise<ApiResponse<Ticket>> => {
    const { data } = await api.get<ApiResponse<Ticket>>(`/tickets/${id}`);
    return data;
  },

  updateTicketStatus: async (
    id: string,
    status: TicketStatus
  ): Promise<ApiResponse<Ticket>> => {
    const { data } = await api.patch<ApiResponse<Ticket>>(`/tickets/${id}/status`, {
      status,
    });
    return data;
  },

  assignOwner: async (
    id: string,
    ownerId: string
  ): Promise<ApiResponse<Ticket>> => {
    const { data } = await api.patch<ApiResponse<Ticket>>(`/tickets/${id}/assign`, {
      ownerId,
    });
    return data;
  },
};
