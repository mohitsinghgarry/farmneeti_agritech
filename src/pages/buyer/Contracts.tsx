import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, Download } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { buyerApi } from '../../services/mockApi';
import { Contract } from '../../types/buyer';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await buyerApi.getContracts();
        setContracts(data);
        setFilteredContracts(data);
      } catch (error) {
        console.error('Failed to fetch contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  useEffect(() => {
    let filtered = contracts;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (contract) =>
          contract.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contract.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contract.commodity.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((contract) => contract.status === statusFilter);
    }

    setFilteredContracts(filtered);
  }, [searchQuery, statusFilter, contracts]);

  const columns = [
    {
      key: 'id',
      label: 'Contract ID',
      render: (value: string) => (
        <span className="font-mono text-blue-600 font-medium">{value}</span>
      ),
    },
    {
      key: 'farmerName',
      label: 'Farmer',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-green-600">
              {value.charAt(0)}
            </span>
          </div>
          <span className="font-medium text-gray-900">{value}</span>
        </div>
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
      key: 'quantity',
      label: 'Quantity',
      align: 'right' as const,
      render: (value: number) => <span className="font-semibold">{value} Qt</span>,
    },
    {
      key: 'agreedPrice',
      label: 'Price',
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatCurrency(value)}/Qt</span>
      ),
    },
    {
      key: 'totalValue',
      label: 'Total Value',
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-semibold text-green-600">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'active'
              ? 'success'
              : value === 'completed'
              ? 'info'
              : 'neutral'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <Button variant="ghost" size="sm" icon={Download}>
          Export
        </Button>
      ),
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const activeCount = contracts.filter(c => c.status === 'active').length;
  const completedCount = contracts.filter(c => c.status === 'completed').length;
  const totalValue = contracts
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.totalValue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
        <p className="text-gray-500 mt-1">Manage your procurement contracts</p>
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
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-purple-600">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Value</p>
              <p className="text-2xl font-bold text-amber-600">₹{(totalValue / 1000).toFixed(0)}K</p>
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
            placeholder="Search by Contract ID, farmer name, or commodity..."
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

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DataTable
          columns={columns}
          data={filteredContracts}
          loading={loading}
          rowKey="id"
          emptyState={{
            title: 'No contracts found',
            message: 'There are no contracts matching your filters.',
          }}
        />
      </motion.div>
    </div>
  );
};

export default Contracts;
