import React, { useEffect, useState } from 'react';
import { Package, TrendingUp, Target, IndianRupee, Plus, Store, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import KPICard from '../../components/ui/KPICard';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { farmerApi } from '../../services/mockApi';
import { ActivityItem } from '../../types/farmer';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<any>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiData, activityData] = await Promise.all([
          farmerApi.getDashboardKPIs(),
          farmerApi.getActivities(),
        ]);
        setKpis(kpiData);
        setActivities(activityData);
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
      key: 'date',
      label: 'Date',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'activity',
      label: 'Activity',
    },
    {
      key: 'commodity',
      label: 'Commodity',
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: any, row: ActivityItem) => (
        <Badge variant={row.statusType === 'success' ? 'success' : row.statusType === 'pending' ? 'warning' : 'info'}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your crops today</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <KPICard
          title="Stored Quantity"
          value={kpis?.storedQuantity || 0}
          icon={Package}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          change="↑ 12% from last month"
          changeType="positive"
          loading={loading}
        />
        <KPICard
          title="Current Market Price"
          value={`₹${kpis?.currentPrice || 0}/Qt`}
          icon={TrendingUp}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          change="↑ 3.2% this week"
          changeType="positive"
          loading={loading}
        />
        <KPICard
          title="Predicted Price (30D)"
          value={`₹${kpis?.predictedPrice || 0}/Qt`}
          icon={Target}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          subtext="HOLD recommended"
          loading={loading}
        />
        <KPICard
          title="Potential Profit"
          value={`₹${kpis?.potentialProfit?.toLocaleString() || 0}`}
          icon={IndianRupee}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          subtext="If sold at predicted price"
          loading={loading}
        />
      </motion.div>

      {/* Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              View All
            </button>
          </div>
          <DataTable
            columns={columns}
            data={activities}
            loading={loading}
            rowKey="id"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <Button
              variant="primary"
              fullWidth
              icon={Plus}
              onClick={() => navigate('/farmer/store-crop')}
            >
              Store New Crop
            </Button>
            <Button
              variant="secondary"
              fullWidth
              icon={TrendingUp}
              onClick={() => navigate('/farmer/price-forecast')}
            >
              Check Prices
            </Button>
            <Button
              variant="secondary"
              fullWidth
              icon={Store}
              onClick={() => navigate('/farmer/marketplace')}
            >
              View Marketplace
            </Button>
            <Button
              variant="secondary"
              fullWidth
              icon={Banknote}
              onClick={() => navigate('/farmer/loans')}
            >
              Apply for Loan
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
