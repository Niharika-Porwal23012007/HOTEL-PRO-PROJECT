import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-input focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-surface text-text border border-border hover:bg-background',
    text: 'bg-transparent text-primary hover:text-primary-hover',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-14',
    md: 'px-4 py-2 text-16',
    lg: 'px-6 py-3 text-18',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
