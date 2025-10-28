import React from 'react';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ElementType; 
  colorClasses: string; 
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon: Icon, colorClasses }) => {
    return (
        <div className="bg-card p-5 rounded-lg shadow-sm border border-border flex items-center gap-5">
            <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${colorClasses}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-3xl font-bold text-foreground">{count}</p>
            </div>
        </div>
    );
};

export default StatCard;