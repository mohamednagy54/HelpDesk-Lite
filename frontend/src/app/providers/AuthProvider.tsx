import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/auth.store';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser, setInitializing, isInitializing } = useAuthStore();
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // If user is already set in store (e.g. just logged in via form), don't do silent refresh
    if (user) {
      setInitializing(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        if (data?.success && data?.data) {
          setUser(data.data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    checkAuth();
  }, [setUser, setInitializing, BASE_URL]);

  if (isInitializing) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-indigo-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
};
