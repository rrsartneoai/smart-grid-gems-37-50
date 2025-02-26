
import { LucideIcon } from 'lucide-react';

// Base company interfaces
export interface Company {
  id: string;
  name: string;
  description: string;
  logo: string;
  energyData: EnergyData[];
  stats: CompanyStats[];
}

export interface CompanyData {
  id: string;
  name: string;
  description: string;
  logo: string;
  energyData?: EnergyData[];
  stats?: CompanyStats[];
}

export interface CompanyStats {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  description: string;
  details: Array<{ label: string; value: string }>;
}

export interface EnergyData {
  name: string;
  consumption: number;
  production: number;
  efficiency: number;
  timestamp?: string;
}

export interface CompanyStoreState {
  selectedCompany: CompanyData | null;
  selectedCompanyId?: string;
  setSelectedCompany: (company: CompanyData | null) => void;
  setSelectedCompanyId?: (id: string) => void;
}

// Air quality related interfaces
export interface AirQualitySource {
  id: string;
  name: string;
  provider: string;
  location: {
    latitude: number;
    longitude: number;
    address?: {
      street?: string;
      number?: string;
      city?: string;
      displayAddress1?: string;
      displayAddress2?: string;
    };
  };
}

export interface AirQualityMeasurement {
  timestamp: string;
  fromDateTime?: string;
  tillDateTime?: string;
  values?: Array<{
    name: string;
    value: number;
  }>;
  indexes?: Array<{
    name: string;
    value: number;
    level: string;
    description: string;
    advice: string;
    color: string;
  }>;
  standards?: Array<{
    name: string;
    pollutant: string;
    limit: number;
    percent: number;
  }>;
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
}

export interface Installation {
  id: number;
  location: {
    latitude: number;
    longitude: number;
    address: {
      street?: string;
      number?: string;
      city?: string;
      displayAddress1?: string;
      displayAddress2?: string;
    };
  };
}

export interface Measurement {
  current: {
    fromDateTime: string;
    tillDateTime: string;
    values: Array<{
      name: string;
      value: number;
    }>;
    indexes: Array<{
      name: string;
      value: number;
      level: string;
      description: string;
      advice: string;
      color: string;
    }>;
    standards: Array<{
      name: string;
      pollutant: string;
      limit: number;
      percent: number;
    }>;
  };
  forecast: any[];
  history: any[];
  location: {
    latitude: number;
    longitude: number;
    address: {
      street?: string;
      number?: string;
      city?: string;
      displayAddress1?: string;
      displayAddress2?: string;
    };
  };
}
