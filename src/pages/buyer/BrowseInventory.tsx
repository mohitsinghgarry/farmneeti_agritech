import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, TrendingDown, Filter, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import MiniSparkline from '../../components/charts/MiniSparkline';
import { buyerApi } from '../../services/mockApi';
import { AvailableInventory } from '../../types/buyer';
import { formatCurrency } from '../../utils/formatCurrency';

const BrowseInventory: React.FC = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<AvailableInventory[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<AvailableInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [commodityFilter, setCommodityFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await buyerApi.getAvailableInventory();
        setInventory(data);
        setFilteredInventory(data);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  useEffect(() => {
    let filtered = inventory;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.warehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply commodity filter
    if (commodityFilter !== 'all') {
      filtered = filtered.filter((item) => item.commodity === commodityFilter);
    }

    // Apply grade filter
    if (gradeFilter !== 'all') {
      filtered = filtered.filter((item) => item.grade === gradeFilter);
    }

    setFilteredInventory(filtered);
  }, [searchQuery, commodityFilter, gradeFilter, inventory]);

  const getPriceTrend = (prices: number[]) => {
    if (prices.length < 2) return 0;
    const first = prices[0];
    const last = prices[prices.length - 1];
    return ((last - first) / first) * 100;
  };

  const columns = [
    {
      key: 'commodity',
      label: 'Commodity',
      render: (value: string, row: AvailableInventory) => (
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-medium text-gray-900">{value}</span>
          </div>
          <div className="mt-1">
            <Badge variant={row.grade === 'A' ? 'success' : row.grade === 'B' ? 'info' : 'neutral'} size="sm">
              Grade {row.grade}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: 'quantity',
      label: 'Available',
      align: 'right' as const,
      render: (value: number) => <span className="font-semibold">{value} Qt</span>,
    },
    {
      key: 'currentPrice',
      label: 'Current Price',
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value)}/Qt</span>
      ),
    },
    {
      key: 'priceTrend',
      label: 'Price Trend',
      render: (value: number[]) => {
        const trend = getPriceTrend(value);
        return (
          <div className="flex items-center gap-2">
            <div className="w-20">
              <MiniSparkline data={value} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend).toFixed(1)}%
            </div>
          </div>
        );
      },
    },
    {
      key: 'warehouse',
      label: 'Warehouse',
      render: (value: string, row: AvailableInventory) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            {row.location}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: AvailableInventory) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/buyer/create-bid', { state: { inventory: row } })}
        >
          Place Bid
        </Button>
      ),
    },
  ];

  const commodityOptions = [
    { value: 'all', label: 'All Commodities' },
    { value: 'Onion', label: 'Onion' },
    { value: 'Potato', label: 'Potato' },
    { value: 'Wheat', label: 'Wheat' },
  ];

  const gradeOptions = [
    { value: 'all', label: 'All Grades' },
    { value: 'A', label: 'Grade A' },
    { value: 'B', label: 'Grade B' },
    { value: 'C', label: 'Grade C' },
  ];

  const totalQuantity = filteredInventory.reduce((sum, item) => sum + item.quantity, 0);
  const avgPrice = filteredInventory.length > 0
    ? Math.round(filteredInventory.reduce((sum, item) => sum + item.currentPrice, 0) / filteredInventory.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Browse Inventory</h1>
        <p className="text-gray-500 mt-1">Explore available crops from verified warehouses</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Filter className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Items</p>
              <p className="text-2xl font-bold text-gray-900">{filteredInventory.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Quantity</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuantity} Qt</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Price</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgPrice)}/Qt</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by commodity, warehouse, or location..."
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={commodityFilter}
            onChange={setCommodityFilter}
            options={commodityOptions}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={gradeFilter}
            onChange={setGradeFilter}
            options={gradeOptions}
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
          data={filteredInventory}
          loading={loading}
          rowKey="id"
          emptyState={{
            title: 'No inventory available',
            message: 'There are no crops matching your filters. Try adjusting your search criteria.',
          }}
        />
      </motion.div>
    </div>
  );
};

export default BrowseInventory;
