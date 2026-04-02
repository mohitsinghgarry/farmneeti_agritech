import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Phone } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { warehouseApi } from '../../services/mockApi';
import { IncomingRequest } from '../../types/warehouse';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../hooks/useToast';

const IncomingRequests: React.FC = () => {
  const { addToast } = useToast();
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<IncomingRequest | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await warehouseApi.getIncomingRequests();
        setRequests(data);
        setFilteredRequests(data);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = requests.filter(
        (req) =>
          req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.commodity.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests);
    }
  }, [searchQuery, requests]);

  const handleAction = (request: IncomingRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      if (modalAction === 'approve') {
        await warehouseApi.approveRequest(selectedRequest.id);
        addToast({
          title: 'Request Approved!',
          message: `Storage request from ${selectedRequest.farmerName} has been approved`,
          type: 'success',
        });
      } else {
        await warehouseApi.rejectRequest(selectedRequest.id);
        addToast({
          title: 'Request Rejected',
          message: `Storage request from ${selectedRequest.farmerName} has been rejected`,
          type: 'info',
        });
      }
      
      // Refresh requests
      const data = await warehouseApi.getIncomingRequests();
      setRequests(data);
      setFilteredRequests(data);
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
      render: (value: string, row: IncomingRequest) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3" />
            {row.farmerPhone}
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
      key: 'requestedDate',
      label: 'Requested',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'pending' ? 'warning' : value === 'approved' ? 'success' : 'neutral'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: IncomingRequest) =>
        row.status === 'pending' ? (
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAction(row, 'approve')}
            >
              Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction(row, 'reject')}
            >
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-sm text-gray-500">—</span>
        ),
    },
  ];

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Incoming Requests</h1>
        <p className="text-gray-500 mt-1">Review and approve storage requests from farmers</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
          <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Approved Today</p>
          <p className="text-3xl font-bold text-green-600">
            {requests.filter(r => r.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Requests</p>
          <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
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
          placeholder="Search by Request ID, farmer name, or commodity..."
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
          data={filteredRequests}
          loading={loading}
          rowKey="id"
          emptyState={{
            title: 'No requests',
            message: 'There are no storage requests at the moment.',
          }}
        />
      </motion.div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !actionLoading && setShowModal(false)}
        title={modalAction === 'approve' ? 'Approve Request' : 'Reject Request'}
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className={`flex items-start gap-3 p-4 rounded-lg ${
              modalAction === 'approve' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              {modalAction === 'approve' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${
                  modalAction === 'approve' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {modalAction === 'approve'
                    ? 'Are you sure you want to approve this request?'
                    : 'Are you sure you want to reject this request?'}
                </p>
                <p className={`text-sm mt-1 ${
                  modalAction === 'approve' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {modalAction === 'approve'
                    ? 'The farmer will be notified and can proceed with storage.'
                    : 'The farmer will be notified of the rejection.'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Request ID</span>
                <span className="font-medium text-gray-900">{selectedRequest.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Farmer</span>
                <span className="font-medium text-gray-900">{selectedRequest.farmerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Commodity</span>
                <span className="font-medium text-gray-900">{selectedRequest.commodity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium text-gray-900">{selectedRequest.quantity} Qt</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Grade</span>
                <span className="font-medium text-gray-900">Grade {selectedRequest.grade}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant={modalAction === 'approve' ? 'primary' : 'danger'}
                fullWidth
                onClick={confirmAction}
                loading={actionLoading}
                disabled={actionLoading}
              >
                {modalAction === 'approve' ? 'Approve Request' : 'Reject Request'}
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

export default IncomingRequests;
