import { User, UserRole } from '../types';
import { Receipt, Bid, PriceForecast, ActivityItem, LoanEligibility, LoanHistory, StorageCropForm } from '../types/farmer';
import { IncomingRequest, StoredBatch, DispatchRecord, WarehouseCapacity } from '../types/warehouse';
import { AvailableInventory, BidForm, Contract } from '../types/buyer';
import { SystemLog, WarehouseApplication, PlatformAnalytics } from '../types/admin';
import { mockUsers } from '../data/mockUsers';
import { 
  mockReceipts, 
  mockBids, 
  mockPriceForecast, 
  mockActivities, 
  mockLoanEligibility, 
  mockLoanHistory 
} from '../data/farmerData';
import {
  mockWarehouseCapacity,
  mockIncomingRequests,
  mockStoredBatches,
  mockDispatches,
} from '../data/warehouseData';
import { mockAvailableInventory, mockContracts } from '../data/buyerData';
import { mockAllUsers, mockWarehouseApplications, mockSystemLogs, mockAnalytics } from '../data/adminData';
import { STORAGE_RATE_PER_QUINTAL_PER_MONTH } from '../utils/constants';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random token hash
const generateTokenHash = (): string => {
  const chars = '0123456789ABCDEF';
  let hash = '0x';
  for (let i = 0; i < 32; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

// Auth API
export const authApi = {
  login: async (email: string, _password: string, role: UserRole): Promise<{ user: User; token: string }> => {
    await delay(800);
    
    const user = mockUsers[email];
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    if (user.role !== role) {
      throw new Error('Invalid credentials');
    }
    
    const token = `mock-jwt-${role}-${Date.now()}`;
    return { user, token };
  },
};

// Farmer API
export const farmerApi = {
  getDashboardKPIs: async () => {
    await delay(400);
    return {
      storedQuantity: 120,
      currentPrice: 1450,
      predictedPrice: 1620,
      potentialProfit: 20400,
    };
  },

  getActivities: async (): Promise<ActivityItem[]> => {
    await delay(300);
    return mockActivities;
  },

  getReceipts: async (): Promise<Receipt[]> => {
    await delay(400);
    return mockReceipts;
  },

  getBids: async (): Promise<Bid[]> => {
    await delay(400);
    return mockBids;
  },

  getPriceForecast: async (commodity: string): Promise<PriceForecast> => {
    await delay(600);
    const key = commodity.toLowerCase();
    return mockPriceForecast[key] || mockPriceForecast.onion;
  },

  getLoanEligibility: async (): Promise<LoanEligibility> => {
    await delay(300);
    return mockLoanEligibility;
  },

  getLoanHistory: async (): Promise<LoanHistory[]> => {
    await delay(300);
    return mockLoanHistory;
  },

  storeCrop: async (data: StorageCropForm): Promise<Receipt> => {
    await delay(1000);
    const newReceipt: Receipt = {
      id: `RCP-2024-${String(mockReceipts.length + 1).padStart(3, '0')}`,
      commodity: data.commodity,
      quantity: data.quantity,
      warehouse: data.warehouse,
      storageDate: new Date().toISOString().split('T')[0],
      tokenHash: generateTokenHash(),
      status: 'active',
      grade: data.grade,
      storageFee: data.quantity * STORAGE_RATE_PER_QUINTAL_PER_MONTH,
    };
    mockReceipts.push(newReceipt);
    return newReceipt;
  },

  acceptBid: async (bidId: string): Promise<Bid | undefined> => {
    await delay(800);
    const bid = mockBids.find(b => b.id === bidId);
    if (bid) {
      bid.status = 'accepted';
    }
    return bid;
  },

  rejectBid: async (bidId: string): Promise<Bid | undefined> => {
    await delay(500);
    const bid = mockBids.find(b => b.id === bidId);
    if (bid) {
      bid.status = 'rejected';
    }
    return bid;
  },
};

// Warehouse API
export const warehouseApi = {
  getCapacity: async (): Promise<WarehouseCapacity> => {
    await delay(400);
    return mockWarehouseCapacity;
  },

  getIncomingRequests: async (): Promise<IncomingRequest[]> => {
    await delay(400);
    return mockIncomingRequests;
  },

  approveRequest: async (requestId: string): Promise<IncomingRequest | undefined> => {
    await delay(800);
    const request = mockIncomingRequests.find(r => r.id === requestId);
    if (request) {
      request.status = 'approved';
    }
    return request;
  },

  rejectRequest: async (requestId: string): Promise<IncomingRequest | undefined> => {
    await delay(500);
    const request = mockIncomingRequests.find(r => r.id === requestId);
    if (request) {
      request.status = 'rejected';
    }
    return request;
  },

  getStoredBatches: async (): Promise<StoredBatch[]> => {
    await delay(400);
    return mockStoredBatches;
  },

  getDispatches: async (): Promise<DispatchRecord[]> => {
    await delay(400);
    return mockDispatches;
  },

  markDispatched: async (dispatchId: string): Promise<DispatchRecord | undefined> => {
    await delay(800);
    const dispatch = mockDispatches.find(d => d.id === dispatchId);
    if (dispatch) {
      dispatch.status = 'in_transit';
    }
    return dispatch;
  },
};

// Buyer API
export const buyerApi = {
  getDashboardKPIs: async () => {
    await delay(400);
    return {
      activeBids: 12,
      wonContracts: 5,
      totalPurchased: 450,
      totalSpent: 834000,
    };
  },

  getAvailableInventory: async (): Promise<AvailableInventory[]> => {
    await delay(400);
    return mockAvailableInventory;
  },

  createBid: async (data: BidForm): Promise<Bid> => {
    await delay(1000);
    const newBid: Bid = {
      id: `BID-${String(mockBids.length + 1).padStart(3, '0')}`,
      buyerName: 'Vikram Mehta',
      buyerVerified: true,
      commodity: data.commodity,
      offeredPrice: data.offeredPrice,
      marketPrice: 1450, // This would be dynamic in real app
      quantity: data.quantity,
      contractDuration: data.contractDuration,
      totalValue: data.offeredPrice * data.quantity,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    mockBids.push(newBid);
    return newBid;
  },

  getContracts: async (): Promise<Contract[]> => {
    await delay(400);
    return mockContracts;
  },
};

// Admin API
export const adminApi = {
  getDashboardKPIs: async () => {
    await delay(400);
    return {
      totalFarmers: 1250,
      totalWarehouses: 34,
      totalTransactions: 4820,
      platformRevenue: 1240000,
    };
  },

  getAllUsers: async (): Promise<User[]> => {
    await delay(400);
    return mockAllUsers;
  },

  updateUserStatus: async (userId: string, status: 'active' | 'suspended'): Promise<User | undefined> => {
    await delay(500);
    const user = mockAllUsers.find(u => u.id === userId);
    if (user) {
      user.status = status;
    }
    return user;
  },

  getWarehouseApplications: async (): Promise<WarehouseApplication[]> => {
    await delay(400);
    return mockWarehouseApplications;
  },

  approveWarehouse: async (appId: string): Promise<WarehouseApplication | undefined> => {
    await delay(800);
    const app = mockWarehouseApplications.find(a => a.id === appId);
    if (app) {
      app.status = 'approved';
    }
    return app;
  },

  rejectWarehouse: async (appId: string): Promise<WarehouseApplication | undefined> => {
    await delay(500);
    const app = mockWarehouseApplications.find(a => a.id === appId);
    if (app) {
      app.status = 'rejected';
    }
    return app;
  },

  getAnalytics: async (): Promise<PlatformAnalytics> => {
    await delay(600);
    return mockAnalytics;
  },

  getSystemLogs: async (): Promise<SystemLog[]> => {
    await delay(300);
    return mockSystemLogs;
  },
};
