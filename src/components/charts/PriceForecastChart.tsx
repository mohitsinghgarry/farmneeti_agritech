import React from 'react';
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { PriceForecast } from '../../types/farmer';
import { formatCurrency } from '../../utils/formatCurrency';

interface PriceForecastChartProps {
  data: PriceForecast;
}

const PriceForecastChart: React.FC<PriceForecastChartProps> = ({ data }) => {
  // Combine all data points
  const chartData = [
    ...data.historicalPrices.map((point) => ({
      date: point.date,
      historical: point.price,
      type: 'historical',
    })),
    ...data.predictedPrices.map((point, index) => ({
      date: point.date,
      predicted: point.price,
      upper: data.confidenceUpper[index]?.price,
      lower: data.confidenceLower[index]?.price,
      type: 'predicted',
    })),
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {formatDate(payload[0].payload.date)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
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
          tickFormatter={(value) => `₹${value}`}
          tick={{ fontSize: 12, fill: '#6B7280' }}
          stroke="#E5E7EB"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />
        
        {/* Confidence Band */}
        <Area
          type="monotone"
          dataKey="upper"
          stroke="none"
          fill="url(#confidenceBand)"
          fillOpacity={1}
        />
        <Area
          type="monotone"
          dataKey="lower"
          stroke="none"
          fill="url(#confidenceBand)"
          fillOpacity={1}
        />

        {/* Reference line for "Today" */}
        <ReferenceLine
          x={data.historicalPrices[data.historicalPrices.length - 1]?.date}
          stroke="#9CA3AF"
          strokeDasharray="5 5"
          label={{ value: 'Today', position: 'top', fill: '#6B7280', fontSize: 12 }}
        />

        {/* Historical Line */}
        <Line
          type="monotone"
          dataKey="historical"
          stroke="#16A34A"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
          name="Historical"
        />

        {/* Predicted Line */}
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="#3B82F6"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          activeDot={{ r: 6 }}
          name="Predicted"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceForecastChart;
