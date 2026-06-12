export type ThemeMode = 'dark' | 'light';

export interface HistoryEntry {
  id: string;
  title: string;
  description: string;
  result: string;
  timestamp: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface UnitOption {
  value: string;
  label: string;
}

export type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed';
