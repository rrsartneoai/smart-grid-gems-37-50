
import { LucideIcon } from "lucide-react";

export interface Company {
  id: string;
  name: string;
  stats: CompanyStat[];
  energyData: EnergyData[];
}

export interface CompanyStat {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  description: string;
  details: Array<{
    label: string;
    value: string;
  }>;
}

export interface EnergyData {
  name: string;
  consumption: number;
  production: number;
  efficiency: number;
  timestamp: string;
}

export interface CompanyStoreState {
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
}

export interface CompanyData extends Company {
  stats: CompanyStat[];
  energyData: EnergyData[];
}
