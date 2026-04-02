export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  service: 'Auth' | 'Storage' | 'Payment' | 'System';
  message: string;
  userId?: string;
}

export interface WarehouseApplication {
  id: string;
  name: string;
  location: string;
  ownerName: string;
  ownerEmail: string;
  capacity: number;
  certifications: string[];
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PlatformAnalytics {
  storageVolume: Array<{ month: string; volume: number }>;
  priceTrends: Array<{ month: string; onion: number; potato: number; wheat: number }>;
  loanDisbursement: Array<{ month: string; amount: number; cumulative: number }>;
  userGrowth: Array<{ month: string; farmers: number; buyers: number; warehouses: number }>;
  transactionVolume: Array<{ date: string; count: number }>;
}
