import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message?: string | null;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm animate-fadeIn"
    >
      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
      <span>{message}</span>
    </div>
  );
};

export default FormError;
