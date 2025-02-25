import { LucideIcon } from 'lucide-react';

export interface CompanyStats {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  description: string;
  details: Array<{
    label: string;
    value: string;
  }>;
}

export interface Company {
  id: string;
  name: string;
  stats: CompanyStats[];
  energyData: Array<{
    name: string;
    consumption: number;
    production: number;
    efficiency: number;
    timestamp?: string;
  }>;
}

export interface CompanyData {
  id: string;
  name: string;
  description: string;
  logo: string;
}

export interface CompanyStoreState {
  selectedCompany: CompanyData | null;
  setSelectedCompany: (company: CompanyData | null) => void;
}

export interface AirQualitySource {
  id: string;
  name: string;
  provider: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address?: {
    street?: string;
    number?: string;
    city?: string;
  };
}

export interface AirQualityMeasurement {
  timestamp: string;
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  o3?: number;
  co?: number;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  provider: string;
}

export interface AirQualityData {
  source: AirQualitySource;
  current: AirQualityMeasurement;
  forecast?: AirQualityMeasurement[];
  history?: AirQualityMeasurement[];
}
