import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '../icons';
import { formatCurrency } from '../../utils/formatters';

interface ForecastingCardProps {
  title: string;
  projectedCost: number;
  budget: number;
}

const ForecastingCard: React.FC<ForecastingCardProps> = ({ title, projectedCost, budget }) => {
  if (projectedCost === 0 || budget === 0) {
      return (
        <div className="bg-white p-5 rounded-lg shadow-md flex-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-400 mt-1">Not enough data</p>
            <p className="text-xs text-slate-400 mt-2">Available for individual, active projects.</p>
        </div>
      );
  }

  const overrun = projectedCost - budget;
  const isOverBudget = overrun > 0;

  const statusInfo = {
    color: isOverBudget ? 'text-red-600' : 'text-green-600',
    bgColor: isOverBudget ? 'bg-red-100' : 'bg-green-100',
    Icon: isOverBudget ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
    text: isOverBudget ? 'Over Budget' : 'Under Budget',
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md flex-1">
      <div className="flex justify-between items-start">
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className={`text-2xl font-bold ${statusInfo.color}`}>{formatCurrency(Math.abs(overrun))}</p>
        </div>
        <div className={`p-2 rounded-md ${statusInfo.bgColor}`}>
          <statusInfo.Icon className={`h-6 w-6 ${statusInfo.color}`} />
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2">Projected to be <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>.</p>
    </div>
  );
};

export default ForecastingCard;
