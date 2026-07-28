import { api } from '@/lib/axios';
import type { AuthResponse } from '../types/auth.types';
import type { LoginInput } from '../schemas/auth.schema';

export const authApi = {
  login: async (credentials: LoginInput): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },
};
