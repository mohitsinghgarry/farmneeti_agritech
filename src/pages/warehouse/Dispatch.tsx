import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Package, CheckCircle } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { warehouseApi } from '../../services/mockApi';
import { DispatchRecord } from '../../types/warehouse';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../hooks/useToast';

const Dispatch: React.FC = () => {
  const { addToast } = useToast();
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([]);
  const [filteredDispatches, setFilteredDispatches] = useState<DispatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDispatch, setSelectedDispatch] = useState<DispatchRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDispatches = async () => {
      try {
        const data = await warehouseApi.getDispatches();
        setDispatches(data);
        setFilteredDispatches(data);
      } catch (error) {
        console.error('Failed to fetch dispatches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDispatches();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = dispatches.filter(
        (dispatch) =>
          dispatch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dispatch.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dispatch.commodity.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDispatches(filtered);
    } else {
      setFilteredDispatches(dispatches);
    }
  }, [searchQuery, dispatches]);

  const handleMarkDispatched = (dispatch: DispatchRecord) => {
    setSelectedDispatch(dispatch);
    setShowModal(true);
  };

  const confirmDispatch = async () => {
    if (!selectedDispatch) return;

    setActionLoading(true);
    try {
      await warehouseApi.markDispatched(selectedDispatch.id);
      addToast({
        title: 'Dispatch Updated!',
        message: `Dispatch ${selectedDispatch.id} marked as in transit`,
        type: 'success',
      });
      
      // Refresh dispatches
      const data = await warehouseApi.getDispatches();
      setDispatches(data);
      setFilteredDispatches(data);
      setShowModal(false);
    } catch (error) {
      addToast({
        title: 'Update failed',
        message: 'Please try again later',
        type: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Dispatch ID',
      render: (value: string) => (
        <span className="font-mono text-blue-600 font-medium">{value}</span>
      ),
    },
    {
      key: 'batchId',
      label: 'Batch ID',
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-600">{value}</span>
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
      key: 'buyerName',
      label: 'Buyer',
    },
    {
      key: 'destination',
      label: 'Destination',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          {value}
        </div>
      ),
    },
    {
      key: 'scheduledDate',
      label: 'Scheduled',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'pending'
              ? 'warning'
              : value === 'in_transit'
              ? 'info'
              : 'success'
          }
        >
          {value === 'in_transit' ? 'In Transit' : value}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: DispatchRecord) =>
        row.status === 'pending' ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleMarkDispatched(row)}
          >
            Mark Dispatched
          </Button>
        ) : (
          <span className="text-sm text-gray-500">—</span>
        ),
    },
  ];

  const pendingCount = dispatches.filter(d => d.status === 'pending').length;
  const inTransitCount = dispatches.filter(d => d.status === 'in_transit').length;
  const deliveredCount = dispatches.filter(d => d.status === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Dispatch Management</h1>
        <p className="text-gray-500 mt-1">Track and manage crop dispatches to buyers</p>
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
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Transit</p>
              <p className="text-2xl font-bold text-blue-600">{inTransitCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{deliveredCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-purple-600">{dispatches.length}</p>
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
          placeholder="Search by Dispatch ID, buyer name, or commodity..."
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
          data={filteredDispatches}
          loading={loading}
          rowKey="id"
          emptyState={{
            title: 'No dispatches',
            message: 'There are no dispatch records at the moment.',
          }}
        />
      </motion.div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !actionLoading && setShowModal(false)}
        title="Mark as Dispatched"
      >
        {selectedDispatch && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50">
              <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">
                  Confirm dispatch for this order?
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  This will update the status to "In Transit" and notify the buyer.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dispatch ID</span>
                <span className="font-medium text-gray-900">{selectedDispatch.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Batch ID</span>
                <span className="font-medium text-gray-900">{selectedDispatch.batchId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Commodity</span>
                <span className="font-medium text-gray-900">{selectedDispatch.commodity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium text-gray-900">{selectedDispatch.quantity} Qt</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Buyer</span>
                <span className="font-medium text-gray-900">{selectedDispatch.buyerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Destination</span>
                <span className="font-medium text-gray-900">{selectedDispatch.destination}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                fullWidth
                onClick={confirmDispatch}
                loading={actionLoading}
                disabled={actionLoading}
              >
                Confirm Dispatch
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

export default Dispatch;
