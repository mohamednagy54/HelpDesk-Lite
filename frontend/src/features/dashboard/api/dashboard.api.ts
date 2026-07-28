import { api } from '@/lib/axios';
import type { SummaryResponse } from '../types/dashboard.types';

export const dashboardApi = {
  getSummary: async (): Promise<SummaryResponse> => {
    const { data } = await api.get<SummaryResponse>('/tickets/summary');
    return data;
  },
};
