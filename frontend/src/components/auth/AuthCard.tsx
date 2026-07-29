import React from 'react';
import { LifeBuoy } from 'lucide-react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="w-full flex items-center justify-center py-6 sm:py-12">
      <div className="w-full max-w-[440px] bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-lg transition-all duration-300">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            HelpDesk <span className="text-indigo-400 font-normal">Lite</span>
          </h1>
          <h2 className="text-base font-semibold text-slate-200 mt-3">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 max-w-xs">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
