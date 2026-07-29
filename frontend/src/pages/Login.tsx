import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { useAuthStore } from '../features/auth/store/auth.store';
import { authApi } from '../features/auth/api/auth.api';
import { loginSchema, type LoginInput } from '../schemas/auth.schema';
import { AuthCard } from '../components/auth/AuthCard';
import { PasswordInput } from '../components/auth/PasswordInput';
import { FormError } from '../components/auth/FormError';

export const Login: React.FC = () => {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
        return;
      }
      switch (user.role) {
        case 'staff':
          navigate('/staff/tickets', { replace: true });
          break;
        case 'manager':
          navigate('/manager/queue', { replace: true });
          break;
        case 'requester':
        default:
          navigate('/my-requests', { replace: true });
          break;
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const response = await authApi.login(data);
      if (!response.success || !response.data) {
         throw new Error(response.message || 'Login failed');
      }
      const user = response.data;
      setUser(user);
      
      // Determine redirection path based on role or location state
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
        return;
      }

      switch (user.role) {
        case 'staff':
          navigate('/staff/tickets', { replace: true });
          break;
        case 'manager':
          navigate('/manager/queue', { replace: true });
          break;
        case 'requester':
        default:
          navigate('/my-requests', { replace: true });
          break;
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 400) {
        setServerError(err.response?.data?.message || 'Invalid login credentials.');
      } else if (err.message) {
        setServerError(err.message === 'Invalid login credentials.' ? err.message : (err.response?.data?.message || 'Invalid login credentials.'));
      } else {
        setServerError('Something went wrong. Please check your connection and try again.');
      }
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your HelpDesk Lite account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoFocus
            autoComplete="email"
            placeholder="you@company.com"
            className={`w-full px-3.5 py-2.5 bg-slate-800/80 border rounded-lg text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.email ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-700 hover:border-slate-600'
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1.5">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Server Error Container */}
        <FormError message={serverError} />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all duration-200 mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Logging in...</span>
            </>
          ) : (
            <span>Login</span>
          )}
        </button>

        {/* Bottom Link */}
        <div className="text-center pt-3 border-t border-slate-800/60 mt-4">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Register
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login;
