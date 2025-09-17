
import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import Card from '../shared/Card';

interface BudgetTrackerProps {
  title: string;
  current: number;
  total: number;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ title, current, total }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const isOverBudget = current > total;

  return (
    <Card>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <span className={`font-bold text-lg ${isOverBudget ? 'text-red-600' : 'text-slate-800'}`}>
          {formatCurrency(current)}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm text-slate-500 mb-1">
        <span>Budget: {formatCurrency(total)}</span>
        <span>{percentage}% Used</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-primary-600'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      {isOverBudget && (
        <p className="text-red-600 text-sm font-semibold mt-2">
          Warning: Budget exceeded by {formatCurrency(current - total)}
        </p>
      )}
    </Card>
  );
};

export default BudgetTracker;
