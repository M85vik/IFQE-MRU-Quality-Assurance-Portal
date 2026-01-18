import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  actionButton?: React.ReactNode;
  className?: string;
}

const CardWhite: React.FC<CardProps> = ({ children, title, actionButton, className = '' }) => {
  return (
    
    <div className={`bg-white rounded-lg border border-border shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
          {actionButton && <div>{actionButton}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
    
  );
};

export default CardWhite;