import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, TrendingUp, IndianRupee, FileCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import KPICard from '../../components/ui/KPICard';
import Button from '../../components/ui/Button';
import { adminApi } from '../../services/mockApi';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpiData = await adminApi.getDashboardKPIs();
        setKpis(kpiData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <p className="text-gray-500 mt-1">Platform overview and management</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <KPICard
          title="Total Farmers"
          value={kpis?.totalFarmers || 0}
          icon={Users}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          change="↑ 12% from last month"
          changeType="positive"
          loading={loading}
        />
        <KPICard
          title="Total Warehouses"
          value={kpis?.totalWarehouses || 0}
          icon={Building2}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          change="↑ 3 new this month"
          changeType="positive"
          loading={loading}
        />
        <KPICard
          title="Total Transactions"
          value={kpis?.totalTransactions || 0}
          icon={TrendingUp}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          change="↑ 18% from last month"
          changeType="positive"
          loading={loading}
        />
        <KPICard
          title="Platform Revenue"
          value={`₹${((kpis?.platformRevenue || 0) / 100000).toFixed(1)}L`}
          icon={IndianRupee}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          change="↑ 15% from last month"
          changeType="positive"
          loading={loading}
        />
      </motion.div>

      {/* Platform Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-green-900">Platform Health</h2>
            <p className="text-sm text-green-700 mt-1">All systems operational</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">API Uptime</p>
            <p className="text-2xl font-bold text-green-600">99.9%</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Avg Response</p>
            <p className="text-2xl font-bold text-green-600">120ms</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Active Users</p>
            <p className="text-2xl font-bold text-green-600">1,847</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Storage Used</p>
            <p className="text-2xl font-bold text-green-600">62%</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New warehouse approved</p>
                <p className="text-xs text-gray-500 mt-1">AgriStore Nashik - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">125 new farmers registered</p>
                <p className="text-xs text-gray-500 mt-1">This week</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Platform revenue milestone</p>
                <p className="text-xs text-gray-500 mt-1">₹1.2L reached - 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">System maintenance scheduled</p>
                <p className="text-xs text-gray-500 mt-1">Tomorrow at 2:00 AM</p>
              </div>
            </div>
          </div>
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
              icon={Users}
              onClick={() => navigate('/admin/user-management')}
            >
              Manage Users
            </Button>
            <Button
              variant="secondary"
              fullWidth
              icon={FileCheck}
              onClick={() => navigate('/admin/warehouse-approval')}
            >
              Approve Warehouses
            </Button>
            <Button
              variant="secondary"
              fullWidth
              icon={TrendingUp}
              onClick={() => navigate('/admin/analytics')}
            >
              View Analytics
            </Button>
            <Button
              variant="secondary"
              fullWidth
              icon={Activity}
              onClick={() => navigate('/admin/system-logs')}
            >
              System Logs
            </Button>
          </div>

          {/* Pending Items */}
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 mt-6">
            <h3 className="font-semibold text-amber-900 mb-3">⚠️ Pending Items</h3>
            <div className="space-y-2 text-sm text-amber-800">
              <div className="flex justify-between">
                <span>Warehouse Applications</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span>User Verifications</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span>Support Tickets</span>
                <span className="font-semibold">5</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
