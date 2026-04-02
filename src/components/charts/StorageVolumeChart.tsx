import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface StorageVolumeData {
  month: string;
  volume: number;
}

interface StorageVolumeChartProps {
  data: StorageVolumeData[];
}

const StorageVolumeChart: React.FC<StorageVolumeChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {payload[0].payload.month}
          </p>
          <p className="text-sm text-green-600">
            Volume: {payload[0].value} Qt
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#6B7280' }}
          stroke="#E5E7EB"
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6B7280' }}
          stroke="#E5E7EB"
          label={{ value: 'Quintals', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6B7280' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar
          dataKey="volume"
          fill="#16A34A"
          radius={[8, 8, 0, 0]}
          name="Storage Volume"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StorageVolumeChart;
