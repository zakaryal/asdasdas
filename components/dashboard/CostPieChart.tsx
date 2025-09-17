import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import Card from '../shared/Card';

// FIX: Add index signature to PieChartData to match recharts' expected data type.
// The recharts library's TypeScript types for data props expect a generic object
// with an index signature, so this change ensures compatibility.
interface PieChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface CostPieChartProps {
  data: PieChartData[];
}

const COLORS = ['#4f46e5', '#10b981']; // Primary, Green

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-lg">
        <p className="font-semibold">{`${payload[0].name}: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};


const CostPieChart: React.FC<CostPieChartProps> = ({ data }) => {
  return (
    <Card title="Cost Breakdown">
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CostPieChart;