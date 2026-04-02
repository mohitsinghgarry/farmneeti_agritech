import { User } from '../types';

export const mockUsers: Record<string, User> = {
  'farmer@test.com': {
    id: 'USR-F001',
    name: 'Ramesh Patil',
    email: 'farmer@test.com',
    role: 'farmer',
    phone: '+91 98765 43210',
    joinedDate: '2023-06-15',
    lastActive: '2024-01-15T10:30:00',
    status: 'active',
  },
  'warehouse@test.com': {
    id: 'USR-W001',
    name: 'Priya Sharma',
    email: 'warehouse@test.com',
    role: 'warehouse',
    phone: '+91 98765 43211',
    joinedDate: '2023-03-10',
    lastActive: '2024-01-15T09:00:00',
    status: 'active',
  },
  'buyer@test.com': {
    id: 'USR-B001',
    name: 'Vikram Mehta',
    email: 'buyer@test.com',
    role: 'buyer',
    phone: '+91 98765 43212',
    joinedDate: '2023-08-20',
    lastActive: '2024-01-15T11:00:00',
    status: 'active',
  },
  'admin@test.com': {
    id: 'USR-A001',
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin',
    phone: '+91 98765 43213',
    joinedDate: '2023-01-01',
    lastActive: '2024-01-15T08:00:00',
    status: 'active',
  },
};
