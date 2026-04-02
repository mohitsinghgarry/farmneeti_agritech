import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { farmerApi } from '../../services/mockApi';
import { Bid } from '../../types/farmer';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { useToast } from '../../hooks/useToast';

const Marketplace: React.FC = () => {
  const { addToast } = useToast();
  const [bids, setBids] = useState<Bid[]>([]);
  const [filteredBids, setFilteredBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'accept' | 'reject'>('accept');

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const data = await farmerApi.getBids();
        setBids(data);
        setFilteredBids(data.filter(b => b.status === 'pending'));
      } catch (error) {
        console.error('Failed to fetch bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = bids.filter(
        (bid) =>
          bid.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bid.commodity.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBids(filtered.filter(b => b.status === 'pending'));
    } else {
      setFilteredBids(bids.filter(b => b.status === 'pending'));
    }
  }, [searchQuery, bids]);

  const handleAction = (bid: Bid, action: 'accept' | 'reject') => {
    setSelectedBid(bid);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedBid) return;

    setActionLoading(true);
    try {
      if (modalAction === 'accept') {
        await farmerApi.acceptBid(selectedBid.id);
        addToast({
          title: 'Bid Accepted!',
          message: `You accepted the bid from ${selectedBid.buyerName}`,
          type: 'success',
        });
      } else {
        await farmerApi.rejectBid(selectedBid.id);
        addToast({
          title: 'Bid Rejected',
          message: `You rejected the bid from ${selectedBid.buyerName}`,
          type: 'info',
        });
      }
      
      // Refresh bids
      const data = await farmerApi.getBids();
      setBids(data);
      setFilteredBids(data.filter(b => b.status === 'pending'));
      setShowModal(false);
    } catch (error) {
      addToast({
        title: 'Action failed',
        message: 'Please try again later',
        type: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getPriceComparison = (offeredPrice: number, marketPrice: number) => {
    const diff = ((offeredPrice - marketPrice) / marketPrice) * 100;
    if (diff > 0) {
      return { text: `+${diff.toFixed(1)}%`, color: 'text-green-600', icon: TrendingUp };
    } else if (diff < 0) {
      return { text: `${diff.toFixed(1)}%`, color: 'text-red-600', icon: TrendingUp };
    }
    return { text: '0%', color: 'text-gray-600', icon: TrendingUp };
  };

  const columns = [
    {
      key: 'buyerName',
      label: 'Buyer',
      render: (value: string, row: Bid) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600">
              {value.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{value}</span>
              {row.buyerVerified && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
          </div>
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
      key: 'offeredPrice',
      label: 'Offered Price',
      align: 'right' as const,
      render: (value: number, row: Bid) => {
        const comparison = getPriceComparison(value, row.marketPrice);
        return (
          <div className="text-right">
            <div className="font-semibold text-gray-900">{formatCurrency(value)}/Qt</div>
            <div className={`text-xs ${comparison.color}`}>{comparison.text} vs market</div>
          </div>
        );
      },
    },
    {
      key: 'quantity',
      label: 'Quantity',
      align: 'right' as const,
      render: (value: number) => <span className="font-medium">{value} Qt</span>,
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
      key: 'contractDuration',
      label: 'Duration',
      render: (value: number) => `${value} days`,
    },
    {
      key: 'createdAt',
      label: 'Received',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Bid) => (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAction(row, 'accept')}
          >
            Accept
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction(row, 'reject')}
          >
            Reject
          </Button>
        </div>
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
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-gray-500 mt-1">Review and manage bids from buyers</p>
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
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Bids</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredBids.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">
                {bids.filter(b => b.status === 'accepted').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Premium</p>
              <p className="text-2xl font-bold text-gray-900">+3.2%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by buyer name or commodity..."
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DataTable
          columns={columns}
          data={filteredBids}
          loading={loading}
          rowKey="id"
          emptyState={{
            title: 'No pending bids',
            message: 'You have no pending bids at the moment. Check back later!',
          }}
        />
      </motion.div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !actionLoading && setShowModal(false)}
        title={modalAction === 'accept' ? 'Accept Bid' : 'Reject Bid'}
      >
        {selectedBid && (
          <div className="space-y-4">
            <div className={`flex items-start gap-3 p-4 rounded-lg ${
              modalAction === 'accept' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              {modalAction === 'accept' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${
                  modalAction === 'accept' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {modalAction === 'accept' 
                    ? 'Are you sure you want to accept this bid?' 
                    : 'Are you sure you want to reject this bid?'}
                </p>
                <p className={`text-sm mt-1 ${
                  modalAction === 'accept' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {modalAction === 'accept'
                    ? 'This will create a binding contract with the buyer.'
                    : 'This action cannot be undone.'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Buyer</span>
                <span className="font-medium text-gray-900">{selectedBid.buyerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Commodity</span>
                <span className="font-medium text-gray-900">{selectedBid.commodity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium text-gray-900">{selectedBid.quantity} Qt</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Offered Price</span>
                <span className="font-medium text-gray-900">{formatCurrency(selectedBid.offeredPrice)}/Qt</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total Value</span>
                <span className="font-bold text-green-600">{formatCurrency(selectedBid.totalValue)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant={modalAction === 'accept' ? 'primary' : 'danger'}
                fullWidth
                onClick={confirmAction}
                loading={actionLoading}
                disabled={actionLoading}
              >
                {modalAction === 'accept' ? 'Accept Bid' : 'Reject Bid'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Marketplace;
