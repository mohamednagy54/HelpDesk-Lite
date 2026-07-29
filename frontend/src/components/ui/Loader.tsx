import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'sm', className = '' }) => {
  const isSm = size === 'sm';
  
  // Dimensions
  const width = isSm ? 20 : 48;
  const height = isSm ? 20 : 48;
  
  // A clean, minimal ticket stack loader that loops seamlessly.
  // We use two rects. The front rect has a solid outline, the back rect has a slightly muted outline.
  // The tailwind animations `animate-ticket-front` and `animate-ticket-back` handle the swapping/stacking motion.
  
  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`} 
      style={{ width, height }}
      aria-label="Loading"
      role="status"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Back Ticket */}
        <rect
          x="3"
          y="6"
          width="14"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-500 animate-ticket-back"
        />
        
        {/* Front Ticket */}
        <rect
          x="7"
          y="4"
          width="14"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          className="text-indigo-400 animate-ticket-front"
          fill="#090d16" /* App background color to hide the back ticket lines when overlapped */
        />
        
        {/* Front Ticket details (lines on the ticket to make it look like a document/ticket) */}
        <g className="animate-ticket-front text-indigo-400">
          <line x1="10" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export default Loader;
