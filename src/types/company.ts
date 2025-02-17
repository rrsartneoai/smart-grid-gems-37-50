
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
