import { api } from '@/lib/axios';
import { Ticket, TicketSummary } from '@/types/ticket';
import { ApiResponse } from '@/types';

export const getAllTickets = async (status?: string): Promise<Ticket[]> => {
  const params = status && status !== 'All' ? { status: status.toLowerCase() } : {};
  const response = await api.get<ApiResponse<Ticket[]>>('/tickets', { params });
  return response.data.data;
};

export const getTicketSummary = async (): Promise<TicketSummary> => {
  const response = await api.get<ApiResponse<TicketSummary>>('/tickets/summary');
  return response.data.data;
};
