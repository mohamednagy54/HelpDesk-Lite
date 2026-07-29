import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginSchema } from '../schemas/auth.schema';
import type { LoginInput } from '../schemas/auth.schema';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export const LoginForm = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (response.success) {
        setUser(response.data);
        toast.success(response.message);
        navigate('/');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  });

  const onSubmit = (data: LoginInput) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Input 
          type="email" 
          placeholder="Email" 
          {...register('email')} 
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Input 
          type="password" 
          placeholder="Password" 
          {...register('password')} 
          className={errors.password ? 'border-destructive' : ''}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
