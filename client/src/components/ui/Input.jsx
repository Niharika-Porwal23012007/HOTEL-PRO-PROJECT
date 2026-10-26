import React from 'react';

export const Input = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-14 font-medium text-text">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 bg-surface border border-border rounded-input text-16 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${error ? 'border-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-14 text-error">{error}</p>
      )}
    </div>
  );
};
