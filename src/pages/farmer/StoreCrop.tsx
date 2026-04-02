import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { farmerApi } from '../../services/mockApi';
import { StorageCropForm } from '../../types/farmer';
import { useToast } from '../../hooks/useToast';

const StoreCrop: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StorageCropForm>({
    commodity: '',
    quantity: 0,
    grade: 'A',
    warehouse: '',
    notes: '',
  });

  const commodities = [
    { value: 'onion', label: 'Onion' },
    { value: 'potato', label: 'Potato' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'rice', label: 'Rice' },
    { value: 'tomato', label: 'Tomato' },
  ];

  const warehouses = [
    { value: 'AgriStore Nashik', label: 'AgriStore Nashik' },
    { value: 'GrainVault Nagpur', label: 'GrainVault Nagpur' },
    { value: 'ColdChain Pune', label: 'ColdChain Pune' },
    { value: 'FreshStore Mumbai', label: 'FreshStore Mumbai' },
  ];

  const grades = [
    { value: 'A', label: 'Grade A - Premium' },
    { value: 'B', label: 'Grade B - Standard' },
    { value: 'C', label: 'Grade C - Basic' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.commodity || !formData.quantity || !formData.warehouse) {
      addToast({
        title: 'Missing fields',
        message: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const receipt = await farmerApi.storeCrop(formData);
      addToast({
        title: 'Success!',
        message: `Crop stored successfully. Receipt ID: ${receipt.id}`,
        type: 'success',
      });
      navigate('/farmer/my-receipts');
    } catch (error) {
      addToast({
        title: 'Failed to store crop',
        message: 'Please try again later',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const estimatedFee = formData.quantity * 15;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/farmer/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Store Crop</h1>
        <p className="text-gray-500 mt-1">Submit your crop for warehouse storage</p>
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
                leftIcon={Scale}
                min={1}
              />
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.grade}
                onChange={(value) => setFormData({ ...formData, grade: value as 'A' | 'B' | 'C' })}
                options={grades}
              />
            </div>

            {/* Warehouse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.warehouse}
                onChange={(value) => setFormData({ ...formData, warehouse: value })}
                options={warehouses}
                placeholder="Select warehouse"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special instructions or notes..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                Submit Storage Request
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/farmer/dashboard')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Cost Estimate */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Estimate</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium text-gray-900">{formData.quantity || 0} Qt</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rate per Qt/month</span>
                <span className="font-medium text-gray-900">₹15</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Estimated Fee</span>
                <span className="font-bold text-green-600">₹{estimatedFee.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Warehouse reviews your request</li>
                  <li>• Quality inspection scheduled</li>
                  <li>• Digital receipt generated</li>
                  <li>• Crop stored securely</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Storage Benefits</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                <span>Blockchain-secured receipts</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                <span>Climate-controlled storage</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                <span>Insurance coverage included</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                <span>Access to marketplace</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoreCrop;
