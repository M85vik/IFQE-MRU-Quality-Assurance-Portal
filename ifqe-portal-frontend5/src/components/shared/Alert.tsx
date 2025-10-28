import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AlertProps {
  message: string | null | undefined;
  type?: 'error' | 'success';
}


const Alert: React.FC<AlertProps> = ({ message, type = 'error' }) => {
  if (!message) return null;

  const styles = {
    error: {
      bg: 'bg-destructive/10',
      border: 'border-destructive/20',
      text: 'text-destructive',
      icon: <AlertCircle className="h-5 w-5 text-destructive" />,
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-600',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    },
  };

  const selectedStyle = styles[type];

  return (
    <div className={`border ${selectedStyle.border} rounded-md ${selectedStyle.bg} p-4`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          {selectedStyle.icon}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${selectedStyle.text}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Alert;