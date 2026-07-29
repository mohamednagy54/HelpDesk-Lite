import { api } from '@/lib/axios';
import type { Ticket, TicketSummary } from '@/types/ticket';
import type { ApiResponse } from '@/types';

export const getAllTickets = async (status?: string): Promise<Ticket[]> => {
  let params: Record<string, string> = {};

  if (status && status !== 'All') {
    if (status === 'open') {
      params = { open: 'true' };
    } else {
      params = { status };
    }
  }

  const response = await api.get<ApiResponse<Ticket[]>>('/tickets/all', { params });
  return response.data.data;
};

export const getTicketSummary = async (): Promise<TicketSummary> => {
  const response = await api.get<ApiResponse<TicketSummary>>('/tickets/summary');
  return response.data.data;
};
