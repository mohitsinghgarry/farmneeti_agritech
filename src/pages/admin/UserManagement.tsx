import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { adminApi } from '../../services/mockApi';
import { User } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../hooks/useToast';

const UserManagement: React.FC = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'activate' | 'suspend'>('activate');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminApi.getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleAction = (user: User, action: 'activate' | 'suspend') => {
    setSelectedUser(user);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      const newStatus = modalAction === 'activate' ? 'active' : 'suspended';
      await adminApi.updateUserStatus(selectedUser.id, newStatus);
      
      addToast({
        title: `User ${modalAction === 'activate' ? 'Activated' : 'Suspended'}`,
        message: `${selectedUser.name} has been ${modalAction === 'activate' ? 'activated' : 'suspended'}`,
        type: 'success',
      });
      
      // Refresh users
      const data = await adminApi.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
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
      label: 'User',
      render: (value: string, row: User) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <Badge
          variant={
            value === 'admin'
              ? 'danger'
              : value === 'warehouse'
              ? 'info'
              : value === 'buyer'
              ? 'warning'
              : 'success'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'joinedDate',
      label: 'Joined',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'neutral'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: User) => (
        <div className="flex gap-2">
          {row.status === 'active' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction(row, 'suspend')}
            >
              Suspend
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAction(row, 'activate')}
            >
              Activate
            </Button>
          )}
        </div>
      ),
    },
  ];

  const activeCount = users.filter(u => u.status === 'active').length;
  const farmerCount = users.filter(u => u.role === 'farmer').length;
  const buyerCount = users.filter(u => u.role === 'buyer').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-1">Manage platform users and permissions</p>
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
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
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
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Farmers</p>
              <p className="text-2xl font-bold text-purple-600">{farmerCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Buyers</p>
              <p className="text-2xl font-bold text-amber-600">{buyerCount}</p>
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
          placeholder="Search by name, email, or role..."
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
          data={filteredUsers}
          loading={loading}
          rowKey="id"
          emptyState={{
            title: 'No users found',
            message: 'There are no users matching your search.',
          }}
        />
      </motion.div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !actionLoading && setShowModal(false)}
        title={modalAction === 'activate' ? 'Activate User' : 'Suspend User'}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className={`flex items-start gap-3 p-4 rounded-lg ${
              modalAction === 'activate' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              {modalAction === 'activate' ? (
                <UserCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <UserX className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${
                  modalAction === 'activate' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {modalAction === 'activate'
                    ? 'Are you sure you want to activate this user?'
                    : 'Are you sure you want to suspend this user?'}
                </p>
                <p className={`text-sm mt-1 ${
                  modalAction === 'activate' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {modalAction === 'activate'
                    ? 'The user will regain access to the platform.'
                    : 'The user will lose access to the platform.'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Name</span>
                <span className="font-medium text-gray-900">{selectedUser.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Role</span>
                <span className="font-medium text-gray-900">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Status</span>
                <span className="font-medium text-gray-900">{selectedUser.status}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant={modalAction === 'activate' ? 'primary' : 'danger'}
                fullWidth
                onClick={confirmAction}
                loading={actionLoading}
                disabled={actionLoading}
              >
                {modalAction === 'activate' ? 'Activate User' : 'Suspend User'}
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

export default UserManagement;
