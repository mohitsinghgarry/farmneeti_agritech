export interface Receipt {
  id: string;
  commodity: string;
  quantity: number;
  warehouse: string;
  storageDate: string;
  tokenHash: string;
  status: 'active' | 'redeemed' | 'expired';
  grade: 'A' | 'B' | 'C';
  storageFee: number;
}

export interface Bid {
  id: string;
  buyerName: string;
  buyerVerified: boolean;
  commodity: string;
  offeredPrice: number;
  marketPrice: number;
  quantity: number;
  contractDuration: number;
  totalValue: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
}

export interface PriceForecast {
  commodity: string;
  historicalPrices: Array<{ date: string; price: number }>;
  predictedPrices: Array<{ date: string; price: number }>;
  confidenceUpper: Array<{ date: string; price: number }>;
  confidenceLower: Array<{ date: string; price: number }>;
  currentPrice: number;
  predictedPrice30d: number;
  confidence: number;
  recommendation: 'HOLD' | 'SELL_NOW' | 'SELL_SOON';
}

export interface LoanEligibility {
  eligibleAmount: number;
  interestRate: number;
  tenure: number;
  monthlyEMI: number;
}

export interface LoanHistory {
  id: string;
  amount: number;
  date: string;
  status: 'active' | 'repaid' | 'overdue';
  repaymentDue: string;
  interestRate: number;
}

export interface StorageCropForm {
  commodity: string;
  quantity: number;
  grade: 'A' | 'B' | 'C';
  warehouse: string;
  notes?: string;
}

export interface ActivityItem {
  id: string;
  date: string;
  activity: string;
  commodity: string;
  status: string;
  statusType: 'success' | 'pending' | 'info';
}
