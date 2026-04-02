import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, MapPin } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { adminApi } from '../../services/mockApi';
import { WarehouseApplication } from '../../types/admin';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../hooks/useToast';

const WarehouseApproval: React.FC = () => {
  const { addToast } = useToast();
  const [applications, setApplications] = useState<WarehouseApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<WarehouseApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<WarehouseApplication | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await adminApi.getWarehouseApplications();
        setApplications(data);
        setFilteredApplications(data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = applications.filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications(applications);
    }
  }, [searchQuery, applications]);

  const handleAction = (app: WarehouseApplication, action: 'approve' | 'reject') => {
    setSelectedApp(app);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedApp) return;

    setActionLoading(true);
    try {
      if (modalAction === 'approve') {
        await adminApi.approveWarehouse(selectedApp.id);
        addToast({
          title: 'Application Approved!',
          message: `${selectedApp.name} has been approved`,
          type: 'success',
        });
      } else {
        await adminApi.rejectWarehouse(selectedApp.id);
        addToast({
          title: 'Application Rejected',
          message: `${selectedApp.name} has been rejected`,
          type: 'info',
        });
      }
      
      const data = await adminApi.getWarehouseApplications();
      setApplications(data);
      setFilteredApplications(data);
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
      key: 'name',
      label: 'Warehouse',
      render: (value: string, row: WarehouseApplication) => (
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
      key: 'ownerName',
      label: 'Owner',
      render: (value: string, row: WarehouseApplication) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.ownerEmail}</div>
        </div>
      ),
    },
    {
      key: 'capacity',
      label: 'Capacity',
      align: 'right' as const,
      render: (value: number) => <span className="font-semibold">{value} Qt</span>,
    },
    {
      key: 'certifications',
      label: 'Certifications',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((cert, idx) => (
            <Badge key={idx} variant="info" size="sm">
              {cert}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="neutral" size="sm">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'appliedDate',
      label: 'Applied',
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
      render: (_: any, row: WarehouseApplication) =>
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

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Warehouse Approval</h1>
        <p className="text-gray-500 mt-1">Review and approve warehouse applications</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Pending</p>
          <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total</p>
          <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by warehouse name, location, or owner..." />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <DataTable columns={columns} data={filteredApplications} loading={loading} rowKey="id" emptyState={{ title: 'No applications', message: 'There are no warehouse applications at the moment.' }} />
      </motion.div>

      <Modal isOpen={showModal} onClose={() => !actionLoading && setShowModal(false)} title={modalAction === 'approve' ? 'Approve Application' : 'Reject Application'}>
        {selectedApp && (
          <div className="space-y-4">
            <div className={`flex items-start gap-3 p-4 rounded-lg ${modalAction === 'approve' ? 'bg-green-50' : 'bg-red-50'}`}>
              {modalAction === 'approve' ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
              <div>
                <p className={`font-medium ${modalAction === 'approve' ? 'text-green-900' : 'text-red-900'}`}>
                  {modalAction === 'approve' ? 'Approve this warehouse application?' : 'Reject this warehouse application?'}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Warehouse</span><span className="font-medium text-gray-900">{selectedApp.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Location</span><span className="font-medium text-gray-900">{selectedApp.location}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Owner</span><span className="font-medium text-gray-900">{selectedApp.ownerName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Capacity</span><span className="font-medium text-gray-900">{selectedApp.capacity} Qt</span></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant={modalAction === 'approve' ? 'primary' : 'danger'} fullWidth onClick={confirmAction} loading={actionLoading} disabled={actionLoading}>
                {modalAction === 'approve' ? 'Approve' : 'Reject'}
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)} disabled={actionLoading}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WarehouseApproval;
