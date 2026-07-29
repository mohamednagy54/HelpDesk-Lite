import React from 'react';
import { LifeBuoy } from 'lucide-react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="w-full flex items-center justify-center py-6 sm:py-12 px-4">
      <div className="w-full max-w-[420px] bg-[#111827] border border-slate-800 rounded-md p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-1.5 rounded-md bg-indigo-950/60 border border-indigo-800/40 text-indigo-400">
            <LifeBuoy className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white">
              HelpDesk <span className="text-indigo-400 font-normal">Lite</span>
            </h1>
            <p className="text-xs text-slate-400">{title}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
