import { api } from './client';
import type { Ticket, CreateTicketPayload, TicketApiResponse } from '../types/ticket';

export const ticketApi = {
  // Fetch tickets submitted by current user
  async getMyTickets(): Promise<Ticket[]> {
    try {
      const response = await api.get<TicketApiResponse<Ticket[]>>('/tickets/my');
      return normalizeTickets(response.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        // Fallback endpoint if /my is not registered on backend
        const fallbackRes = await api.get<TicketApiResponse<Ticket[]>>('/tickets/mine');
        return normalizeTickets(fallbackRes.data.data);
      }
      throw err;
    }
  },

  // Create a new support ticket
  async createTicket(payload: CreateTicketPayload): Promise<Ticket> {
    const response = await api.post<TicketApiResponse<Ticket>>('/tickets', payload);
    return normalizeTicket(response.data.data);
  },

  // Get ticket details by ID
  async getTicketById(id: string): Promise<Ticket> {
    const response = await api.get<TicketApiResponse<Ticket>>(`/tickets/${id}`);
    return normalizeTicket(response.data.data);
  },
};

// Helper to ensure _id is mapped to id consistently
function normalizeTicket(item: any): Ticket {
  if (!item) return item;
  return {
    ...item,
    id: item.id || item._id || '',
    created_at: item.created_at || item.createdAt || new Date().toISOString(),
  };
}

function normalizeTickets(items: any[]): Ticket[] {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeTicket);
}
