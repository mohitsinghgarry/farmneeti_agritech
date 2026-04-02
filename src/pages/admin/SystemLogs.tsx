import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import { adminApi } from '../../services/mockApi';
import { SystemLog } from '../../types/admin';
import { formatDate } from '../../utils/formatDate';

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await adminApi.getSystemLogs();
        setLogs(data);
        setFilteredLogs(data);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.service.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter((log) => log.level === levelFilter);
    }

    // Apply service filter
    if (serviceFilter !== 'all') {
      filtered = filtered.filter((log) => log.service === serviceFilter);
    }

    setFilteredLogs(filtered);
  }, [searchQuery, levelFilter, serviceFilter, logs]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{formatDate(value)}</span>
      ),
    },
    {
      key: 'level',
      label: 'Level',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getLevelIcon(value)}
          <Badge
            variant={
              value === 'error' ? 'danger' : value === 'warning' ? 'warning' : 'info'
            }
          >
            {value}
          </Badge>
        </div>
      ),
    },
    {
      key: 'service',
      label: 'Service',
      render: (value: string) => (
        <Badge variant="neutral">{value}</Badge>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      render: (value: string) => (
        <span className="text-sm text-gray-900">{value}</span>
      ),
    },
    {
      key: 'userId',
      label: 'User ID',
      render: (value?: string) => (
        <span className="text-sm text-gray-500 font-mono">
          {value || '—'}
        </span>
      ),
    },
  ];

  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
  ];

  const serviceOptions = [
    { value: 'all', label: 'All Services' },
    { value: 'Auth', label: 'Auth' },
    { value: 'Storage', label: 'Storage' },
    { value: 'Payment', label: 'Payment' },
    { value: 'System', label: 'System' },
  ];

  const errorCount = logs.filter(l => l.level === 'error').length;
  const warningCount = logs.filter(l => l.level === 'warning').length;
  const infoCount = logs.filter(l => l.level === 'info').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
        <p className="text-gray-500 mt-1">Monitor platform activity and errors</p>
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
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Errors</p>
              <p className="text-2xl font-bold text-red-600">{errorCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Warnings</p>
              <p className="text-2xl font-bold text-amber-600">{warningCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Info</p>
              <p className="text-2xl font-bold text-blue-600">{infoCount}</p>
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
            placeholder="Search logs by message or service..."
          />
        </div>
        <div className="w-48">
          <Select
            value={levelFilter}
            onChange={setLevelFilter}
            options={levelOptions}
          />
        </div>
        <div className="w-48">
          <Select
            value={serviceFilter}
            onChange={setServiceFilter}
            options={serviceOptions}
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
          data={filteredLogs}
          loading={loading}
          rowKey="id"
          emptyState={{
            title: 'No logs found',
            message: 'There are no system logs matching your filters.',
          }}
        />
      </motion.div>
    </div>
  );
};

export default SystemLogs;
