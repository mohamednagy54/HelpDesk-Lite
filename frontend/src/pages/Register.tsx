import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { useAuthStore } from '../features/auth/store/auth.store';
import { authApi } from '../features/auth/api/auth.api';
import { registerSchema, type RegisterInput } from '../schemas/auth.schema';
import { AuthCard } from '../components/auth/AuthCard';
import { PasswordInput } from '../components/auth/PasswordInput';
import { FormError } from '../components/auth/FormError';

export const Register: React.FC = () => {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated && user) {
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
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'requester',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      const response = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Registration failed');
      }

      const user = response.data;
      setUser(user);

      // Redirect user by assigned role after successful auto-login
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
      if (err.response?.status === 409 || err.response?.data?.message?.includes('already exists')) {
        setServerError('This email is already registered');
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err.message) {
        setServerError(err.message);
      } else {
        setServerError('Registration failed. Please check your inputs and try again.');
      }
    }
  };

  return (
    <AuthCard title="Create an account" subtitle="Join HelpDesk Lite to manage support tickets">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        {/* Full Name Field */}
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoFocus
            autoComplete="name"
            placeholder="John Doe"
            className={`w-full px-3.5 py-2.5 bg-slate-800/80 border rounded-lg text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.name ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-700 hover:border-slate-600'
            }`}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
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
          <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            error={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-300 mb-1">
            Confirm Password
          </label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter password"
            error={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Role Select Dropdown */}
        <div>
          <label htmlFor="role" className="block text-xs font-medium text-slate-300 mb-1">
            Account Role
          </label>
          <select
            id="role"
            className={`w-full px-3.5 py-2.5 bg-slate-800/80 border rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.role ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-700 hover:border-slate-600'
            }`}
            {...register('role')}
          >
            <option value="requester" className="bg-slate-900 text-slate-100">Requester (Submit support requests)</option>
            <option value="staff" className="bg-slate-900 text-slate-100">Staff (Resolve support tickets)</option>
            <option value="manager" className="bg-slate-900 text-slate-100">Manager (Oversee queue & summary)</option>
          </select>
          {errors.role && (
            <p className="text-xs text-red-400 mt-1">{errors.role.message}</p>
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
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>

        {/* Bottom Link */}
        <div className="text-center pt-3 border-t border-slate-800/60 mt-3">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Login
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default Register;
