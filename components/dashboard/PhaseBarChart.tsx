import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import Card from '../shared/Card';

interface BarChartData {
  name: string;
  cost: number;
}

interface PhaseBarChartProps {
  data: BarChartData[];
}

const PhaseBarChart: React.FC<PhaseBarChartProps> = ({ data }) => {
  return (
    <Card title="Cost per Phase">
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
            <BarChart
                data={data}
                margin={{
                top: 5,
                right: 20,
                left: 30,
                bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(tick) => `${Math.round(tick / 1000)}K`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="cost" fill="#4f46e5" />
            </BarChart>
            </ResponsiveContainer>
        </div>
    </Card>
  );
};

export default PhaseBarChart;