import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ScaleIcon } from '../icons';
import { formatCurrency } from '../../utils/formatters';

interface KPICardProps {
  title: string;
  value: number;
  subtitle?: string;
  status: 'positive' | 'negative' | 'neutral';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, status }) => {
  const isPositive = status === 'positive';

  const statusInfo = {
    positive: {
      Icon: ArrowTrendingDownIcon, // Favorable trend (e.g., cost under budget)
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    negative: {
      Icon: ArrowTrendingUpIcon, // Unfavorable trend (e.g., cost over budget)
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    neutral: {
      Icon: ScaleIcon,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
    },
  }[status];

  const formattedValue = formatCurrency(value);

  return (
    <div className="bg-white p-5 rounded-lg shadow-md flex-1">
      <div className="flex justify-between items-start">
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className={`text-2xl font-bold ${statusInfo.color}`}>{formattedValue}</p>
        </div>
        <div className={`p-2 rounded-md ${statusInfo.bgColor}`}>
          <statusInfo.Icon className={`h-6 w-6 ${statusInfo.color}`} />
        </div>
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
    </div>
  );
};

export default KPICard;
