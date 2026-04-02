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

interface UserGrowthData {
  month: string;
  farmers: number;
  buyers: number;
  warehouses: number;
}

interface UserGrowthChartProps {
  data: UserGrowthData[];
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {payload[0].payload.month}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
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
          tick={{ fontSize: 12, fill: '#6B7280' }}
          stroke="#E5E7EB"
          label={{ value: 'Users', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6B7280' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
        <Line
          type="monotone"
          dataKey="farmers"
          stroke="#16A34A"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Farmers"
        />
        <Line
          type="monotone"
          dataKey="buyers"
          stroke="#F59E0B"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Buyers"
        />
        <Line
          type="monotone"
          dataKey="warehouses"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Warehouses"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default UserGrowthChart;
