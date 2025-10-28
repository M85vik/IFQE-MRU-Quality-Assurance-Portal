import React from 'react';

interface ScorecardProps {
  title: string;
  score: number | string; 
  maxScore?: number;
  colorClass?: string;
}


const Scorecard: React.FC<ScorecardProps> = ({ title, score, maxScore = 500, colorClass = "bg-primary" }) => {
    const numericScore = typeof score === 'number' ? score : 0;
    const percentage = maxScore > 0 ? (numericScore / maxScore) * 100 : 0;

    return (
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
            <div className="flex items-baseline justify-center">
                <p className="text-4xl font-bold text-card-foreground">{score}</p>
                <span className="text-lg text-muted-foreground ml-1">/ {maxScore}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5 mt-3">
                <div
                    className={`${colorClass} h-2.5 rounded-full`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default Scorecard;