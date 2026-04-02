export interface AvailableInventory {
  id: string;
  commodity: string;
  grade: 'A' | 'B' | 'C';
  quantity: number;
  warehouse: string;
  location: string;
  currentPrice: number;
  priceTrend: number[];
}

export interface BidForm {
  commodity: string;
  offeredPrice: number;
  quantity: number;
  contractDuration: 30 | 60 | 90;
  preferredWarehouse?: string;
  specialRequirements?: string;
}

export interface Contract {
  id: string;
  farmerName: string;
  commodity: string;
  quantity: number;
  agreedPrice: number;
  totalValue: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
}
