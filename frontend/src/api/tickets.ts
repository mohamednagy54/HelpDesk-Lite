import { api } from '@/lib/axios';
import type { Ticket, TicketSummary } from '@/types/ticket';
import type { ApiResponse } from '@/types';

/**
 * Get all tickets — optionally filtered by status.
 * Pass 'open' to get all tickets that are NOT Closed.
 * Pass 'All' or undefined to get every ticket.
 * Pass a specific status name to filter by it.
 */
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
