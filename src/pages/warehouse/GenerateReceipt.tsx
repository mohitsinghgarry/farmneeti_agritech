import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Hash, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useToast } from '../../hooks/useToast';

const GenerateReceipt: React.FC = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<any>(null);
  const [formData, setFormData] = useState({
    farmerName: '',
    farmerPhone: '',
    commodity: '',
    quantity: 0,
    grade: 'A',
    section: '',
  });

  const commodities = [
    { value: 'onion', label: 'Onion' },
    { value: 'potato', label: 'Potato' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'rice', label: 'Rice' },
    { value: 'tomato', label: 'Tomato' },
  ];

  const grades = [
    { value: 'A', label: 'Grade A - Premium' },
    { value: 'B', label: 'Grade B - Standard' },
    { value: 'C', label: 'Grade C - Basic' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.farmerName || !formData.commodity || !formData.quantity || !formData.section) {
      addToast({
        title: 'Missing fields',
        message: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const receipt = {
        id: `RCP-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        tokenHash: `0x${Array.from({ length: 32 }, () => 
          Math.floor(Math.random() * 16).toString(16).toUpperCase()
        ).join('')}`,
        ...formData,
        storageDate: new Date().toISOString().split('T')[0],
        storageFee: formData.quantity * 15,
      };

      setGeneratedReceipt(receipt);
      addToast({
        title: 'Receipt Generated!',
        message: `Receipt ${receipt.id} has been created successfully`,
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Generation failed',
        message: 'Please try again later',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      farmerName: '',
      farmerPhone: '',
      commodity: '',
      quantity: 0,
      grade: 'A',
      section: '',
    });
    setGeneratedReceipt(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Generate Receipt</h1>
        <p className="text-gray-500 mt-1">Create digital warehouse receipt for stored crops</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleGenerate} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Receipt Details</h3>

            {/* Farmer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farmer Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.farmerName}
                onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                placeholder="Enter farmer name"
                leftIcon={User}
              />
            </div>

            {/* Farmer Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farmer Phone
              </label>
              <Input
                type="tel"
                value={formData.farmerPhone}
                onChange={(e) => setFormData({ ...formData, farmerPhone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

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
                onChange={(value) => setFormData({ ...formData, grade: value })}
                options={grades}
              />
            </div>

            {/* Storage Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Section <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                placeholder="e.g., A-12, B-08"
                leftIcon={Hash}
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
                Generate Receipt
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Preview / Result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {generatedReceipt ? (
            /* Generated Receipt */
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Receipt Generated</h3>
                  <p className="text-sm text-green-700">Successfully created</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Receipt ID</p>
                  <p className="font-mono font-semibold text-blue-600">{generatedReceipt.id}</p>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Farmer</span>
                    <span className="font-medium text-gray-900">{generatedReceipt.farmerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Commodity</span>
                    <span className="font-medium text-gray-900">{generatedReceipt.commodity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium text-gray-900">{generatedReceipt.quantity} Qt</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Grade</span>
                    <span className="font-medium text-gray-900">Grade {generatedReceipt.grade}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Section</span>
                    <span className="font-medium text-gray-900">{generatedReceipt.section}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Storage Date</span>
                    <span className="font-medium text-gray-900">{generatedReceipt.storageDate}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs text-gray-500 mb-1">Token Hash</p>
                  <p className="font-mono text-xs text-gray-600 break-all">
                    {generatedReceipt.tokenHash}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Storage Fee</span>
                    <span className="font-bold text-green-600">₹{generatedReceipt.storageFee}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button variant="primary" fullWidth icon={FileText}>
                  Download PDF
                </Button>
                <Button variant="secondary" fullWidth onClick={handleReset}>
                  Generate Another
                </Button>
              </div>
            </div>
          ) : (
            /* Info Card */
            <>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Receipt Information</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                    <span>Blockchain-secured digital receipt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                    <span>Unique token hash for verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                    <span>Instant farmer notification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                    <span>Downloadable PDF format</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Storage Fee</h4>
                    <p className="text-sm text-blue-800">
                      Storage fee is calculated at ₹15 per quintal per month. 
                      The fee will be automatically calculated based on quantity.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GenerateReceipt;
