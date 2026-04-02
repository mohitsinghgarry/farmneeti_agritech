import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TransactionVolumeData {
  date: string;
  count: number;
}

interface TransactionVolumeChartProps {
  data: TransactionVolumeData[];
}

const TransactionVolumeChart: React.FC<TransactionVolumeChartProps> = ({ data }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {formatDate(payload[0].payload.date)}
          </p>
          <p className="text-sm text-purple-600">
            Transactions: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 12, fill: '#6B7280' }}
          stroke="#E5E7EB"
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6B7280' }}
          stroke="#E5E7EB"
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#8B5CF6"
          strokeWidth={2}
          fill="url(#colorCount)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TransactionVolumeChart;
