import { AirQualityData } from './airQuality.types';

// Updated CompanyStats interface to match how it's being used
export interface CompanyStat {
  title: string;
  value: string | number;
  unit?: string;
  icon: any;
  description: string;
  details: { label: string; value: string }[];
}

// Updating Company interface
export interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  contact?: {
    email: string;
    phone: string;
    address: string;
  };
  stats: CompanyStat[];
  energyData: any[]; // This can be more specific if needed
}

// Keeping the original CompanyStats for backward compatibility
export interface CompanyStats {
  employees: number;
  customers: number;
  projects: number;
  energySaved: number;
}

// Updated CompanyData interface
export interface CompanyData {
  companies: Company[];
}

// Updated CompanyStoreState to include selectedCompanyId
export interface CompanyStoreState {
  selectedCompany: Company | null;
  selectedCompanyId: string;
  setSelectedCompany: (company: Company) => void;
  setSelectedCompanyId: (id: string) => void;
}
