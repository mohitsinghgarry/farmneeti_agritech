import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { farmerApi } from '../../services/mockApi';
import { Receipt } from '../../types/farmer';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../hooks/useToast';

const MyReceipts: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const data = await farmerApi.getReceipts();
        setReceipts(data);
        setFilteredReceipts(data);
      } catch (error) {
        console.error('Failed to fetch receipts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = receipts.filter(
        (receipt) =>
          receipt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          receipt.commodity.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReceipts(filtered);
    } else {
      setFilteredReceipts(receipts);
    }
  }, [searchQuery, receipts]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      addToast({
        title: 'Copied!',
        message: 'Token hash copied to clipboard',
        type: 'success',
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      addToast({
        title: 'Failed to copy',
        type: 'error',
      });
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Receipt ID',
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
      key: 'quantity',
      label: 'Quantity',
      align: 'right' as const,
      render: (value: number) => <span className="font-semibold">{value} Qt</span>,
    },
    {
      key: 'warehouse',
      label: 'Warehouse',
    },
    {
      key: 'storageDate',
      label: 'Storage Date',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'tokenHash',
      label: 'Token Hash',
      render: (value: string, row: Receipt) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-600">
            {value.substring(0, 10)}...
          </span>
          <button
            onClick={() => copyToClipboard(value, row.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {copiedId === row.id ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'active' ? 'success' : value === 'redeemed' ? 'info' : 'neutral'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: () => (
        <Button variant="ghost" size="sm">
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Receipts</h1>
          <p className="text-gray-500 mt-1">Digital warehouse receipts for your stored crops</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/farmer/store-crop')}>
          Store Crop
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4"
      >
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Receipt ID or commodity..."
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          columns={columns}
          data={filteredReceipts}
          loading={loading}
          rowKey="id"
          emptyState={{
            title: 'No receipts yet',
            message: 'Store your first crop to get a digital warehouse receipt.',
            action: {
              label: 'Store Crop',
              onClick: () => navigate('/farmer/store-crop'),
            },
          }}
        />
      </motion.div>
    </div>
  );
};

export default MyReceipts;
