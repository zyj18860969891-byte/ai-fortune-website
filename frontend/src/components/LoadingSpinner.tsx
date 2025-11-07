import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-mystical-purple/30 border-t-mystical-purple rounded-full animate-spin"></div>
        
        {/* Inner ring */}
        <div className="absolute top-2 left-2 w-8 h-8 border-4 border-mystical-gold/30 border-t-mystical-gold rounded-full animate-spin animation-delay-150"></div>
        
        {/* Center dot */}
        <div className="absolute top-6 left-6 w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>
      
      <p className="mt-4 text-mystical-purple text-sm font-medium">
        星象正在为你编织命运...
      </p>
    </div>
  );
};

export const LoadingDots: React.FC = () => {
  return (
    <div className="loading-dots">
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};