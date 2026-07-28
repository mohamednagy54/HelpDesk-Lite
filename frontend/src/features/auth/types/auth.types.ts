export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'requester' | 'staff' | 'manager';
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
}
