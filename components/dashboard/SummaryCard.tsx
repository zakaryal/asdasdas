import React, { ElementType } from 'react';
import Card from '../shared/Card';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: ElementType;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <Card className="flex items-center p-4">
      <div className={`rounded-md p-3 ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4 flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">{title}</p>
        <p className="text-2xl font-bold text-slate-800 truncate">{value}</p>
      </div>
    </Card>
  );
};

export default SummaryCard;