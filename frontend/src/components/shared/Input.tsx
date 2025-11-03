import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string; 
}


const Input: React.FC<InputProps> = ({ id, label, type = 'text', error, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-1">
        {label}
      </label>
      <input
        id={id}
        name={id} 
        type={type}
        className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 transition-colors ${
          error 
          ? 'border-destructive focus:ring-destructive' 
          : 'border-input focus:ring-ring'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default Input;