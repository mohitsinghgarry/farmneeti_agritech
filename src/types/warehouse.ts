export interface IncomingRequest {
  id: string;
  farmerName: string;
  farmerPhone: string;
  commodity: string;
  quantity: number;
  grade: 'A' | 'B' | 'C';
  requestedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface StoredBatch {
  id: string;
  commodity: string;
  farmerName: string;
  quantity: number;
  grade: 'A' | 'B' | 'C';
  storageDate: string;
  duration: number;
  storageFee: number;
  status: 'active' | 'renewal_due' | 'expiring_soon';
  section?: string;
}

export interface DispatchRecord {
  id: string;
  batchId: string;
  commodity: string;
  quantity: number;
  buyerName: string;
  destination: string;
  scheduledDate: string;
  status: 'pending' | 'in_transit' | 'delivered';
}

export interface WarehouseCapacity {
  total: number;
  used: number;
  available: number;
  commodityBreakdown: Array<{
    commodity: string;
    quantity: number;
    color: string;
  }>;
}
