import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, ArrowLeft, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { buyerApi } from '../../services/mockApi';
import { BidForm } from '../../types/buyer';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatCurrency';

const CreateBid: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const prefilledInventory = location.state?.inventory;
  
  const [formData, setFormData] = useState<BidForm>({
    commodity: prefilledInventory?.commodity || '',
    offeredPrice: prefilledInventory?.currentPrice || 0,
    quantity: prefilledInventory?.quantity || 0,
    contractDuration: 60,
    preferredWarehouse: prefilledInventory?.warehouse || '',
    specialRequirements: '',
  });

  const commodities = [
    { value: 'Onion', label: 'Onion' },
    { value: 'Potato', label: 'Potato' },
    { value: 'Wheat', label: 'Wheat' },
    { value: 'Rice', label: 'Rice' },
    { value: 'Tomato', label: 'Tomato' },
  ];

  const durations = [
    { value: '30', label: '30 Days' },
    { value: '60', label: '60 Days' },
    { value: '90', label: '90 Days' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.commodity || !formData.offeredPrice || !formData.quantity) {
      addToast({
        title: 'Missing fields',
        message: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    if (formData.offeredPrice <= 0 || formData.quantity <= 0) {
      addToast({
        title: 'Invalid values',
        message: 'Price and quantity must be greater than zero',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const bid = await buyerApi.createBid(formData);
      addToast({
        title: 'Bid Submitted!',
        message: `Your bid ${bid.id} has been submitted successfully`,
        type: 'success',
      });
      navigate('/buyer/dashboard');
    } catch (error) {
      addToast({
        title: 'Failed to submit bid',
        message: 'Please try again later',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const totalValue = formData.offeredPrice * formData.quantity;
  const marketPrice = prefilledInventory?.currentPrice || formData.offeredPrice;
  const priceDiff = formData.offeredPrice - marketPrice;
  const priceDiffPercent = marketPrice > 0 ? ((priceDiff / marketPrice) * 100).toFixed(1) : '0';
  const isCompetitive = Math.abs(Number(priceDiffPercent)) <= 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/buyer/browse-inventory')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create Bid</h1>
        <p className="text-gray-500 mt-1">Submit your bid for crop procurement</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Bid Details</h3>

            {/* Commodity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commodity <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.commodity}
                onChange={(value) => setFormData({ ...formData, commodity: value })}
                options={commodities}
                placeholder="Select commodity"
              />
            </div>

            {/* Offered Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offered Price (per Quintal) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.offeredPrice || ''}
                onChange={(e) => setFormData({ ...formData, offeredPrice: Number(e.target.value) })}
                placeholder="Enter price"
                leftIcon={TrendingUp}
                min={1}
              />
              {prefilledInventory && (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Market price: {formatCurrency(marketPrice)}/Qt
                  </p>
                  {priceDiff !== 0 && (
                    <p className={`text-xs font-medium ${priceDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {priceDiff >= 0 ? '+' : ''}{priceDiffPercent}% vs market
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (Quintals) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.quantity || ''}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                placeholder="Enter quantity"
                leftIcon={ShoppingBag}
                min={1}
              />
              {prefilledInventory && (
                <p className="text-xs text-gray-500 mt-1">
                  Available: {prefilledInventory.quantity} Qt
                </p>
              )}
            </div>

            {/* Contract Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Duration <span className="text-red-500">*</span>
              </label>
              <Select
                value={String(formData.contractDuration)}
                onChange={(value) => setFormData({ ...formData, contractDuration: Number(value) as 30 | 60 | 90 })}
                options={durations}
              />
            </div>

            {/* Preferred Warehouse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Warehouse
              </label>
              <Input
                type="text"
                value={formData.preferredWarehouse}
                onChange={(e) => setFormData({ ...formData, preferredWarehouse: e.target.value })}
                placeholder="Enter warehouse name (optional)"
              />
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements
              </label>
              <textarea
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                placeholder="Any special requirements or notes..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
                fullWidth
              >
                Submit Bid
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/buyer/browse-inventory')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Summary & Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Bid Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bid Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Commodity</span>
                <span className="font-medium text-gray-900">{formData.commodity || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium text-gray-900">{formData.quantity || 0} Qt</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Offered Price</span>
                <span className="font-medium text-gray-900">{formatCurrency(formData.offeredPrice)}/Qt</span>
              </div>
              {prefilledInventory && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">vs Market</span>
                  <span className={`font-medium ${priceDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceDiff >= 0 ? '+' : ''}{priceDiffPercent}%
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium text-gray-900">{formData.contractDuration} days</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total Value</span>
                <span className="font-bold text-green-600">{formatCurrency(totalValue)}</span>
              </div>
            </div>
          </div>

          {/* Competitiveness Indicator */}
          {prefilledInventory && (
            <div className={`rounded-xl border p-6 ${
              isCompetitive ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex gap-3">
                {isCompetitive ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={`font-semibold mb-1 ${
                    isCompetitive ? 'text-green-900' : 'text-amber-900'
                  }`}>
                    {isCompetitive ? 'Competitive Bid' : 'Consider Adjusting'}
                  </h4>
                  <p className={`text-sm ${
                    isCompetitive ? 'text-green-800' : 'text-amber-800'
                  }`}>
                    {isCompetitive
                      ? 'Your bid is within 5% of market price and has a high acceptance rate.'
                      : 'Bids within 5% of market price have an 85% acceptance rate.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Bidding Tips</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Offer competitive prices for better acceptance</li>
                  <li>• Be clear about your requirements</li>
                  <li>• Respond quickly to farmer responses</li>
                  <li>• Build long-term relationships</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateBid;
