import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MiniSparklineProps {
  data: number[];
}

const MiniSparkline: React.FC<MiniSparklineProps> = ({ data }) => {
  const chartData = data.map((value, index) => ({ value, index }));
  const isPositive = data[data.length - 1] >= data[0];

  return (
    <ResponsiveContainer width={80} height={30}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={isPositive ? '#16A34A' : '#DC2626'}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MiniSparkline;
