import React from 'react';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-gold/20 border-t-gold animate-spin`}
      />
      {text && (
        <p className="text-xs tracking-widest uppercase text-gold font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

