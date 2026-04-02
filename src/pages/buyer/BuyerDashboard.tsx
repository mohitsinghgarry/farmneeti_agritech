import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, FileText, Package, IndianRupee, TrendingUp, TrendingDown, Search, Plus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import KPICard from '../../components/ui/KPICard';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import MiniSparkline from '../../components/charts/MiniSparkline';
import { buyerApi } from '../../services/mockApi';
import { Contract } from '../../types/buyer';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<any>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiData, contractsData] = await Promise.all([
          buyerApi.getDashboardKPIs(),
          buyerApi.getContracts(),
        ]);
        setKpis(kpiData);
        setContracts(contractsData.filter(c => c.status === 'active').slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      key: 'id',
      label: 'Contract ID',
      render: (value: string) => (
        <span className="font-mono text-blue-600 font-medium text-sm">{value}</span>
      ),
    },
    {
      key: 'farmerName',
      label: 'Farmer',
      render: (value: string) => (
        <span className="text-sm font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'commodity',
      label: 'Commodity',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      label: 'Quantity',
      align: 'right' as const,
      render: (value: number) => <span className="font-semibold text-sm">{value} Qt</span>,
    },
    {
      key: 'totalValue',
      label: 'Total Value',
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-semibold text-green-600 text-sm">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (value: string) => <span className="text-sm text-gray-600">{formatDate(value)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'neutral'} size="sm">
          {value}
        </Badge>
      ),
    },
  ];

  // Mock market data
  const marketData = [
    { name: 'Onion', price: 1450, trend: [1400, 1380, 1420, 1450, 1480, 1450], change: 3.2 },
    { name: 'Wheat', price: 2200, trend: [2250, 2240, 2220, 2210, 2205, 2200], change: -1.8 },
    { name: 'Potato', price: 980, trend: [1020, 1010, 995, 990, 985, 980], change: -3.9 },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your procurement overview</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <KPICard
          title="Active Bids"
          value={kpis?.activeBids || 0}
          icon={ShoppingBag}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          subtext="Pending responses"
          loading={loading}
        />
        <KPICard
          title="Won Contracts"
          value={kpis?.wonContracts || 0}
          icon={FileText}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          change="↑ 15% from last month"
          changeType="positive"
          loading={loading}
        />
        <KPICard
          title="Total Purchased"
          value={`${kpis?.totalPurchased || 0} Qt`}
          icon={Package}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          subtext="This month"
          loading={loading}
        />
        <KPICard
          title="Total Spent"
          value={`₹${((kpis?.totalSpent || 0) / 1000).toFixed(0)}K`}
          icon={IndianRupee}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          change="↑ 8% from last month"
          changeType="positive"
          loading={loading}
        />
      </motion.div>

      {/* Market Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Market Insights</h2>
            <p className="text-sm text-blue-700 mt-1">Current commodity trends</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketData.map((item) => (
            <div key={item.name} className="bg-white rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{item.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(item.price)}/Qt</p>
                </div>
                <div className="w-16">
                  <MiniSparkline data={item.trend} />
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                item.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(item.change).toFixed(1)}% this week
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contracts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Contracts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Contracts</h2>
            <button
              onClick={() => navigate('/buyer/contracts')}
              className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              View All
            </button>
          </div>
          <DataTable
            columns={columns}
            data={contracts}
            loading={loading}
            rowKey="id"
            emptyState={{
              title: 'No active contracts',
              message: 'You have no active contracts at the moment.',
            }}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <Button
              variant="primary"
              fullWidth
              icon={Search}
              onClick={() => navigate('/buyer/browse-inventory')}
            >
              Browse Inventory
            </Button>
            <Button
              variant="secondary"
              fullWidth
              icon={Plus}
              onClick={() => navigate('/buyer/create-bid')}
            >
              Create New Bid
            </Button>
            <Button
              variant="secondary"
              fullWidth
              icon={FileText}
              onClick={() => navigate('/buyer/contracts')}
            >
              View Contracts
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 mt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">💡 Pro Tip</h3>
                <p className="text-sm text-amber-800">
                  Place bids early in the week for better prices. Farmers are more likely to accept competitive offers.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
