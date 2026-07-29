import React from 'react';
import { Loader } from '@/components/ui/Loader';
import { Card } from '@/components/ui/Card';

export const LoaderPreview: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-100">Ticket-Stack Loader Preview</h1>
          <p className="text-sm text-slate-400">
            A pure SVG/CSS animation that matches the brand and ticketing metaphor.
          </p>
        </div>

        <Card className="p-10 flex flex-col items-center justify-center space-y-8 bg-slate-900/60 border-slate-800">
          
          {/* Large Loader */}
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Large (lg)</h2>
            <Loader size="lg" />
            <p className="text-xs text-slate-400 text-center max-w-xs">
              Used for full-page loading states (e.g. fetching global ticket queue)
            </p>
          </div>
          
          <div className="w-full h-px bg-slate-800/60"></div>
          
          {/* Small Loader */}
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Small (sm)</h2>
            <div className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-5 py-2.5 rounded-lg gap-2 cursor-wait transition-colors">
              <Loader size="sm" className="text-white" />
              <span>Submitting Request...</span>
            </div>
            <p className="text-xs text-slate-400 text-center max-w-xs">
              Used inline within buttons and micro-interactions
            </p>
          </div>

        </Card>
      </div>
    </div>
  );
};
