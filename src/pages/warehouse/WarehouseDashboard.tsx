import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, AlertCircle, IndianRupee, FileText, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import KPICard from '../../components/ui/KPICard';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { warehouseApi } from '../../services/mockApi';
import { IncomingRequest, WarehouseCapacity } from '../../types/warehouse';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';

const WarehouseDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [capacity, setCapacity] = useState<WarehouseCapacity | null>(null);
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [capacityData, requestsData] = await Promise.all([
          warehouseApi.getCapacity(),
          warehouseApi.getIncomingRequests(),
        ]);
        setCapacity(capacityData);
        setRequests(requestsData.filter(r => r.status === 'pending').slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const utilizationPercent = capacity ? Math.round((capacity.used / capacity.total) * 100) : 0;

  const columns = [
    {
      key: 'id',
      label: 'Request ID',
      render: (value: string) => (
        <span className="font-mono text-blue-600 font-medium">{value}</span>
      ),
    },
    {
      key: 'farmerName',
      label: 'Farmer',
    },
    {
      key: 'commodity',
      label: 'Commodity',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          {value}
        </div>
      ),
    },
    {
      key: 'quantity',
      label: 'Quantity',
      align: 'right' as const,
      render: (value: number) => <span className="font-semibold">{value} Qt</span>,
    },
    {
      key: 'requestedDate',
      label: 'Requested',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'pending' ? 'warning' : 'success'}>
          {value}
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
      >
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your warehouse overview</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <KPICard
          title="Storage Utilization"
          value={`${utilizationPercent}%`}
          icon={Package}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          change={`${capacity?.used || 0}/${capacity?.total || 0} Qt`}
          changeType="neutral"
          loading={loading}
        />
        <KPICard
          title="Pending Requests"
          value={requests.length}
          icon={AlertCircle}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          subtext="Awaiting approval"
          loading={loading}
        />
        <KPICard
          title="Active Batches"
          value={205}
          icon={TrendingUp}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          change="↑ 8% from last month"
          changeType="positive"
          loading={loading}
        />
        <KPICard
          title="Monthly Revenue"
          value="₹1.2L"
          icon={IndianRupee}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          change="↑ 12% from last month"
          changeType="positive"
          loading={loading}
        />
      </motion.div>

      {/* Capacity Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage Capacity</h2>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Used: {capacity?.used || 0} Qt</span>
            <span className="text-gray-600">Available: {capacity?.available || 0} Qt</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
              style={{ width: `${utilizationPercent}%` }}
            />
          </div>
        </div>

        {/* Commodity Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {capacity?.commodityBreakdown.map((item) => (
            <div key={item.commodity} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{item.commodity}</p>
                  <p className="text-lg font-semibold text-gray-900">{item.quantity} Qt</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Requests and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Requests</h2>
            <button
              onClick={() => navigate('/warehouse/incoming-requests')}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View All
            </button>
          </div>
          <DataTable
            columns={columns}
            data={requests}
            loading={loading}
            rowKey="id"
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
              icon={AlertCircle}
              onClick={() => navigate('/warehouse/incoming-requests')}
            >
              Review Requests
            </Button>
            <Button
              variant="secondary"
              fullWidth
              icon={Package}
              onClick={() => navigate('/warehouse/stored-inventory')}
            >
              View Inventory
            </Button>
            <Button
              variant="secondary"
              fullWidth
              icon={FileText}
              onClick={() => navigate('/warehouse/generate-receipt')}
            >
              Generate Receipt
            </Button>
            <Button
              variant="secondary"
              fullWidth
              icon={Truck}
              onClick={() => navigate('/warehouse/dispatch')}
            >
              Manage Dispatch
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;
