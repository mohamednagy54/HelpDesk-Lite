import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/auth.store';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setInitializing, isInitializing } = useAuthStore();
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        if (data?.success && data?.data) {
          setUser(data.data);
        }
      } catch (error) {
        // Silent fail, user is just not logged in (no refresh token or expired)
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    checkAuth();
  }, [setUser, setInitializing, BASE_URL]);

  if (isInitializing) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
};
