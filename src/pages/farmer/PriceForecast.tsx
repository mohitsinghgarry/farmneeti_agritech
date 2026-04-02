import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import PriceForecastChart from '../../components/charts/PriceForecastChart';
import Badge from '../../components/ui/Badge';
import { farmerApi } from '../../services/mockApi';
import { PriceForecast } from '../../types/farmer';
import { formatCurrency } from '../../utils/formatCurrency';

const PriceForecastPage: React.FC = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('onion');
  const [forecast, setForecast] = useState<PriceForecast | null>(null);
  const [loading, setLoading] = useState(true);

  const commodities = [
    { id: 'onion', label: 'Onion', icon: '🧅' },
    { id: 'potato', label: 'Potato', icon: '🥔' },
    { id: 'wheat', label: 'Wheat', icon: '🌾' },
  ];

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const data = await farmerApi.getPriceForecast(selectedCommodity);
        setForecast(data);
      } catch (error) {
        console.error('Failed to fetch forecast:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [selectedCommodity]);

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case 'HOLD':
        return { variant: 'info' as const, icon: Minus, text: 'HOLD' };
      case 'SELL_NOW':
        return { variant: 'danger' as const, icon: TrendingDown, text: 'SELL NOW' };
      case 'SELL_SOON':
        return { variant: 'warning' as const, icon: TrendingUp, text: 'SELL SOON' };
      default:
        return { variant: 'neutral' as const, icon: Minus, text: 'HOLD' };
    }
  };

  const recommendation = forecast ? getRecommendationBadge(forecast.recommendation) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Price Forecast</h1>
        <p className="text-gray-500 mt-1">AI-powered price predictions for your crops</p>
      </motion.div>

      {/* Commodity Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 border-b border-gray-200"
      >
        {commodities.map((commodity) => (
          <button
            key={commodity.id}
            onClick={() => setSelectedCommodity(commodity.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
              selectedCommodity === commodity.id
                ? 'text-green-700 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-xl">{commodity.icon}</span>
            {commodity.label}
          </button>
        ))}
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Current Price</p>
          <p className="text-3xl font-bold text-gray-900">
            {forecast ? formatCurrency(forecast.currentPrice) : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1">per Quintal</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500 mb-2">30-Day Prediction</p>
          <p className="text-3xl font-bold text-gray-900">
            {forecast ? formatCurrency(forecast.predictedPrice30d) : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Confidence: {forecast?.confidence || 0}%
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Recommendation</p>
          {recommendation && (
            <>
              <Badge variant={recommendation.variant} size="md" className="text-base px-4 py-2">
                {recommendation.text}
              </Badge>
              <p className="text-xs text-gray-500 mt-3">
                {recommendation.text === 'HOLD' && 'Wait for better prices'}
                {recommendation.text === 'SELL NOW' && 'Prices may decline soon'}
                {recommendation.text === 'SELL SOON' && 'Good time to sell'}
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Price Forecast — {commodities.find(c => c.id === selectedCommodity)?.label}
          </h2>
        </div>
        {forecast && !loading ? (
          <PriceForecastChart data={forecast} />
        ) : (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
          </div>
        )}
      </motion.div>

      {/* Market Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Factors</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div>
                <p className="font-medium text-gray-900">Monsoon Forecast</p>
                <p className="text-sm text-gray-500">Normal rainfall expected this season</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <p className="font-medium text-gray-900">Supply Levels</p>
                <p className="text-sm text-gray-500">Current supply is moderate</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
              <div>
                <p className="font-medium text-gray-900">Demand Indicators</p>
                <p className="text-sm text-gray-500">Steady demand from urban markets</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Comparison</h3>
          <p className="text-sm text-gray-500">
            Compared to last year, prices are currently{' '}
            <span className="font-semibold text-green-600">8% higher</span> for the same period.
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Year (Jan)</span>
              <span className="font-semibold text-gray-900">₹1,340/Qt</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">This Year (Jan)</span>
              <span className="font-semibold text-gray-900">₹1,450/Qt</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PriceForecastPage;
