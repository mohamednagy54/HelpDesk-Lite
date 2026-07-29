import { api } from './api';
import type { LoginPayload, RegisterPayload, AuthResponse, User } from '../types/auth.types';

export const authService = {
  async login(credentials: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },
};

export const extractUserAndToken = (data: AuthResponse['data']): { user: User; token: string } => {
  const token = data.token;
  
  if (data.user) {
    return { user: data.user, token };
  }

  const user: User = {
    id: data.id || data._id || '',
    name: data.name || '',
    email: data.email || '',
    role: data.role || 'requester',
  };

  return { user, token };
};
