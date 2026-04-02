import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import EmptyState from './EmptyState';
import { cn } from '../../utils/cn';

interface Column<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: {
    title: string;
    message: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  onRowClick?: (row: T) => void;
  rowKey: string;
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyState,
  onRowClick,
  rowKey,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <EmptyState {...emptyState} />;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider',
                    column.align === 'right' && 'text-right',
                    column.align === 'center' && 'text-center',
                    !column.align && 'text-left'
                  )}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <motion.tr
                key={row[rowKey]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-gray-100 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-gray-50/50'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-sm text-gray-900',
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center'
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
