export const COMMODITIES = ['Onion', 'Potato', 'Wheat'];

export const GRADES = ['A', 'B', 'C'] as const;

export const WAREHOUSES = [
  { id: 'wh-1', name: 'AgriStore Nashik', available: 3800 },
  { id: 'wh-2', name: 'ColdChain Pune', available: 1200 },
  { id: 'wh-3', name: 'GrainVault Nagpur', available: 2400 },
];

export const CONTRACT_DURATIONS = [30, 60, 90];

export const STORAGE_RATE_PER_QUINTAL_PER_MONTH = 15;

export const PLATFORM_FEE_PERCENTAGE = 2;

export const COMMODITY_ICONS: Record<string, string> = {
  Onion: '🧅',
  Potato: '🥔',
  Wheat: '🌾',
};
