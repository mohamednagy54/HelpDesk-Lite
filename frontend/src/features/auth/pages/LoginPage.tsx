import React from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-6 rounded-lg bg-background p-8 shadow-md border">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password to access your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
