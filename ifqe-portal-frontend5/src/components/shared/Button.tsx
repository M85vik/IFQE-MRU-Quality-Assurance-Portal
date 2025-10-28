import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'glow' | 'ghost'; // <-- Add 'ghost'
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', isLoading = false, fullWidth = false, className = '', ...props }) => {
  const baseClasses = "font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-opacity-75 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center";

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'bg-transparent text-foreground border border-border hover:bg-accent hover:text-accent-foreground',
    glow: 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  const sizeClasses = {
    sm: 'py-1.5 px-3 rounded-sm text-xs',
    md: 'py-2 px-4 rounded-md text-sm',
    lg: 'py-3 px-6 rounded-lg text-base',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;