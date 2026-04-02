import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Banknote, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { farmerApi } from '../../services/mockApi';
import { LoanEligibility, LoanHistory } from '../../types/farmer';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../hooks/useToast';

const Loans: React.FC = () => {
  const { addToast } = useToast();
  const [eligibility, setEligibility] = useState<LoanEligibility | null>(null);
  const [loanHistory, setLoanHistory] = useState<LoanHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eligibilityData, historyData] = await Promise.all([
          farmerApi.getLoanEligibility(),
          farmerApi.getLoanHistory(),
        ]);
        setEligibility(eligibilityData);
        setLoanHistory(historyData);
        setRequestedAmount(eligibilityData.eligibleAmount);
      } catch (error) {
        console.error('Failed to fetch loan data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApplyLoan = async () => {
    if (!requestedAmount || requestedAmount <= 0) {
      addToast({
        title: 'Invalid amount',
        message: 'Please enter a valid loan amount',
        type: 'error',
      });
      return;
    }

    if (eligibility && requestedAmount > eligibility.eligibleAmount) {
      addToast({
        title: 'Amount exceeds limit',
        message: `Maximum eligible amount is ${formatCurrency(eligibility.eligibleAmount)}`,
        type: 'error',
      });
      return;
    }

    setApplyLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      addToast({
        title: 'Application Submitted!',
        message: 'Your loan application is under review. You will be notified soon.',
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Application failed',
        message: 'Please try again later',
        type: 'error',
      });
    } finally {
      setApplyLoading(false);
    }
  };

  const calculateEMI = (amount: number) => {
    if (!eligibility) return 0;
    const monthlyRate = eligibility.interestRate / 12 / 100;
    const months = eligibility.tenure / 30;
    return Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
  };

  const columns = [
    {
      key: 'id',
      label: 'Loan ID',
      render: (value: string) => (
        <span className="font-mono text-blue-600 font-medium">{value}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'date',
      label: 'Disbursed On',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'repaymentDue',
      label: 'Due Date',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'interestRate',
      label: 'Interest',
      render: (value: number) => `${value}% p.a.`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'active' ? 'warning' : value === 'repaid' ? 'success' : 'danger'
          }
        >
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
        <p className="text-gray-500 mt-1">Apply for loans based on your stored crops</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eligibility & Application */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Eligibility Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-green-900">Loan Eligibility</h2>
                <p className="text-sm text-green-700 mt-1">Based on your stored crops</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-8 bg-green-200 rounded w-1/2" />
                <div className="h-4 bg-green-200 rounded w-3/4" />
              </div>
            ) : eligibility ? (
              <div>
                <p className="text-3xl font-bold text-green-900">
                  {formatCurrency(eligibility.eligibleAmount)}
                </p>
                <p className="text-sm text-green-700 mt-1">Maximum eligible amount</p>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div>
                    <p className="text-xs text-green-700">Interest Rate</p>
                    <p className="text-lg font-semibold text-green-900">{eligibility.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-700">Tenure</p>
                    <p className="text-lg font-semibold text-green-900">{eligibility.tenure} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-700">Monthly EMI</p>
                    <p className="text-lg font-semibold text-green-900">{formatCurrency(eligibility.monthlyEMI)}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Application Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for Loan</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount
                </label>
                <Input
                  type="number"
                  value={requestedAmount || ''}
                  onChange={(e) => setRequestedAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                  leftIcon={Banknote}
                  min={1}
                  max={eligibility?.eligibleAmount}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: {eligibility ? formatCurrency(eligibility.eligibleAmount) : '—'}
                </p>
              </div>

              {requestedAmount > 0 && eligibility && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-medium text-gray-900">{formatCurrency(requestedAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-medium text-gray-900">{eligibility.interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tenure</span>
                    <span className="font-medium text-gray-900">{eligibility.tenure} days</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Monthly EMI</span>
                    <span className="font-bold text-green-600">{formatCurrency(calculateEMI(requestedAmount))}</span>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                fullWidth
                onClick={handleApplyLoan}
                loading={applyLoading}
                disabled={applyLoading || !requestedAmount}
              >
                Submit Application
              </Button>
            </div>
          </div>

          {/* Loan History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan History</h3>
            <DataTable
              columns={columns}
              data={loanHistory}
              loading={loading}
              rowKey="id"
              emptyState={{
                title: 'No loan history',
                message: 'You have not taken any loans yet.',
              }}
            />
          </div>
        </motion.div>

        {/* Info Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* How it Works */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How it Works</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-green-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Check Eligibility</p>
                  <p className="text-sm text-gray-500">Based on stored crops value</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-green-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Apply Online</p>
                  <p className="text-sm text-gray-500">Quick digital application</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-green-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Get Approved</p>
                  <p className="text-sm text-gray-500">Instant approval in most cases</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-green-600">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Receive Funds</p>
                  <p className="text-sm text-gray-500">Direct bank transfer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Loan Benefits</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Low interest rates</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>No collateral required</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Flexible repayment terms</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Quick approval process</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Based on crop value</span>
              </li>
            </ul>
          </div>

          {/* Important Note */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">Important</h4>
                <p className="text-sm text-amber-800">
                  Loan eligibility is calculated based on 70% of your stored crop value. 
                  Ensure timely repayment to maintain good credit standing.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loans;
