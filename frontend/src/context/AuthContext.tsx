import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginPayload, RegisterPayload, AuthContextType } from '../types/auth.types';
import { authService, extractUserAndToken } from '../services/auth.service';
import { api, TOKEN_KEY } from '../services/api';

const USER_KEY = 'helpdesk_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = useCallback(async (credentials: LoginPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Login failed');
      }

      const { user: userData, token: jwtToken } = extractUserAndToken(res.data);

      localStorage.setItem(TOKEN_KEY, jwtToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      setToken(jwtToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

      return userData;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.register(userData);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Registration failed');
      }

      const { user: newUser, token: jwtToken } = extractUserAndToken(res.data);

      localStorage.setItem(TOKEN_KEY, jwtToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));

      setToken(jwtToken);
      setUser(newUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

      return newUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
