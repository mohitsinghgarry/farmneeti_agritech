import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, Clock } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import { warehouseApi } from '../../services/mockApi';
import { StoredBatch } from '../../types/warehouse';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const StoredInventory: React.FC = () => {
  const [batches, setBatches] = useState<StoredBatch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<StoredBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await warehouseApi.getStoredBatches();
        setBatches(data);
        setFilteredBatches(data);
      } catch (error) {
        console.error('Failed to fetch batches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    let filtered = batches;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (batch) =>
          batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          batch.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          batch.commodity.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((batch) => batch.status === statusFilter);
    }

    setFilteredBatches(filtered);
  }, [searchQuery, statusFilter, batches]);

  const columns = [
    {
      key: 'id',
      label: 'Batch ID',
      render: (value: string) => (
        <span className="font-mono text-blue-600 font-medium">{value}</span>
      ),
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
      key: 'farmerName',
      label: 'Farmer',
    },
    {
      key: 'quantity',
      label: 'Quantity',
      align: 'right' as const,
      render: (value: number) => <span className="font-semibold">{value} Qt</span>,
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (value: string) => (
        <Badge variant={value === 'A' ? 'success' : value === 'B' ? 'info' : 'neutral'}>
          Grade {value}
        </Badge>
      ),
    },
    {
      key: 'section',
      label: 'Section',
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: 'storageDate',
      label: 'Storage Date',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (value: number) => `${value} days`,
    },
    {
      key: 'storageFee',
      label: 'Fee',
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-semibold text-green-600">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'active'
              ? 'success'
              : value === 'renewal_due'
              ? 'warning'
              : 'danger'
          }
        >
          {value === 'renewal_due' ? 'Renewal Due' : value === 'expiring_soon' ? 'Expiring Soon' : value}
        </Badge>
      ),
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'renewal_due', label: 'Renewal Due' },
    { value: 'expiring_soon', label: 'Expiring Soon' },
  ];

  const totalQuantity = batches.reduce((sum, batch) => sum + batch.quantity, 0);
  const activeCount = batches.filter(b => b.status === 'active').length;
  const renewalDueCount = batches.filter(b => b.status === 'renewal_due').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Stored Inventory</h1>
        <p className="text-gray-500 mt-1">Manage all stored crop batches</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Batches</p>
              <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Batches</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Renewal Due</p>
              <p className="text-2xl font-bold text-amber-600">{renewalDueCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Quantity</p>
              <p className="text-2xl font-bold text-purple-600">{totalQuantity} Qt</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4"
      >
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Batch ID, farmer name, or commodity..."
          />
        </div>
        <div className="w-64">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
          />
        </div>
      </motion.div>

      {/* Alerts */}
      {renewalDueCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">
                {renewalDueCount} batch{renewalDueCount > 1 ? 'es' : ''} require renewal
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Contact farmers to renew storage contracts before expiration
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <DataTable
          columns={columns}
          data={filteredBatches}
          loading={loading}
          rowKey="id"
          emptyState={{
            title: 'No batches found',
            message: 'There are no stored batches matching your filters.',
          }}
        />
      </motion.div>
    </div>
  );
};

export default StoredInventory;
