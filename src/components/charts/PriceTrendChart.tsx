import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

interface PriceTrendData {
  month: string;
  onion: number;
  potato: number;
  wheat: number;
}

interface PriceTrendChartProps {
  data: PriceTrendData[];
}

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {payload[0].payload.month}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}/Qt
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#6B7280' }}
          stroke="#E5E7EB"
        />
        <YAxis
          tickFormatter={(value) => `₹${value}`}
          tick={{ fontSize: 12, fill: '#6B7280' }}
          stroke="#E5E7EB"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
        <Line
          type="monotone"
          dataKey="onion"
          stroke="#DC2626"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Onion"
        />
        <Line
          type="monotone"
          dataKey="potato"
          stroke="#F59E0B"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Potato"
        />
        <Line
          type="monotone"
          dataKey="wheat"
          stroke="#16A34A"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Wheat"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceTrendChart;
