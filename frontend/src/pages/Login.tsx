import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '../features/auth/store/auth.store';
import { authApi } from '../features/auth/api/auth.api';
import { loginSchema, type LoginInput } from '../schemas/auth.schema';
import { AuthCard } from '../components/auth/AuthCard';
import { PasswordInput } from '../components/auth/PasswordInput';
import { FormError } from '../components/auth/FormError';
import { Loader } from '../components/ui/Loader';

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
            className={`w-full px-3 py-2 bg-slate-900 border rounded-md text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.email ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-800 hover:border-slate-700'
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
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs rounded-md flex items-center justify-center gap-2 transition-all duration-150 mt-1"
        >
          {isSubmitting ? (
            <>
              <Loader size="sm" className="text-white" />
              <span>Logging in...</span>
            </>
          ) : (
            <span>Login</span>
          )}
        </button>

        {/* Bottom Link */}
        <div className="text-center pt-3 border-t border-slate-800 mt-4">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Register
            </Link>
          </p>
        </div>

        {/* Testing Credentials Box */}
        <div className="mt-5 p-3.5 rounded-md bg-slate-950/60 border border-slate-800">
          <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 border-b border-slate-800 pb-1.5">Testing Credentials</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="block text-purple-400 font-medium text-[11px]">Manager</span>
                <span className="text-slate-400 font-mono text-[11px]">admin@test.com</span>
              </div>
              <span className="font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px]">Aa123456</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="block text-indigo-400 font-medium text-[11px]">Staff</span>
                <span className="text-slate-400 font-mono text-[11px]">staff@test.com</span>
              </div>
              <span className="font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px]">Aa123456</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="block text-emerald-400 font-medium text-[11px]">Requester</span>
                <span className="text-slate-400 font-mono text-[11px]">team@test.com</span>
              </div>
              <span className="font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px]">Aa123456</span>
            </div>
          </div>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login;
