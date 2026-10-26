import React from 'react';

export const Badge = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const variants = {
    default: 'bg-surface border border-border text-text',
    pending: 'bg-warning/10 border border-warning text-warning',
    confirmed: 'bg-success/10 border border-success text-success',
    cancelled: 'bg-error/10 border border-error text-error',
    completed: 'bg-primary/10 border border-primary text-primary',
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-14 font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
