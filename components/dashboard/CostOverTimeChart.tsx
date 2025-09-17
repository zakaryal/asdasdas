import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { CostOverTimeData } from '../../types';
import Card from '../shared/Card';

interface CostOverTimeChartProps {
  data: CostOverTimeData[];
}

const CostOverTimeChart: React.FC<CostOverTimeChartProps> = ({ data }) => {
  return (
    <Card title="Cumulative Cost Over Time">
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(tick) => `${Math.round(tick / 1000000)}M`}/>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="cost" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </Card>
  );
};

export default CostOverTimeChart;