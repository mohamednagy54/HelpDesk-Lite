export type UserRole = 'requester' | 'staff' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponseData {
  token: string;
  user?: User;
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: AuthResponseData;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<User>;
  register: (userData: RegisterPayload) => Promise<User>;
  logout: () => void;
}
