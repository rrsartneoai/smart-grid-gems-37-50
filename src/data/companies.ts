
import { Company } from "@/types/company";
import { 
  Battery, 
  Zap, 
  Gauge, 
  Activity, 
  Power, 
  Timer, 
  Flame,
  DollarSign 
} from "lucide-react";

const baseCompany: Company = {
  id: "1",
  name: "Firma energetyczna",
  stats: [
    {
      title: "Moc",
      value: "15,234",
      unit: "MW",
      icon: Power,
      description: "↗️ +2.1% od ostatniego odczytu",
      details: [
        { label: "Szczyt", value: "16,234 MW" },
        { label: "Minimum", value: "13,567 MW" },
      ],
    },
    {
      title: "Zużycie",
      value: "12,345",
      unit: "kWh",
      icon: Zap,
      description: "↘️ -0.5% od ostatniej godziny",
      details: [
        { label: "Dzienne", value: "295,080 kWh" },
        { label: "Miesięczne", value: "8,852,400 kWh" },
      ],
    },
    {
      title: "Sprawność",
      value: "94.5",
      unit: "%",
      icon: Gauge,
      description: "↗️ +0.2% od wczoraj",
      details: [
        { label: "Min", value: "92%" },
        { label: "Max", value: "96%" },
      ],
    },
    {
      title: "Status",
      value: "Optymalny",
      icon: Activity,
      description: "Wszystkie systemy sprawne",
      details: [
        { label: "Uptime", value: "99.9%" },
        { label: "Awarie", value: "0" },
      ],
    },
    {
      title: "Temperatura",
      value: "42",
      unit: "°C",
      icon: Flame,
      description: "W normie",
      details: [
        { label: "Min", value: "38°C" },
        { label: "Max", value: "45°C" },
      ],
    },
    {
      title: "Koszty",
      value: "4,567",
      unit: "PLN/h",
      icon: DollarSign,
      description: "↗️ +1.2% od ostatniej godziny",
      details: [
        { label: "Dzienne", value: "109,608 PLN" },
        { label: "Miesięczne", value: "3,288,240 PLN" },
      ],
    },
    {
      title: "Baterie",
      value: "85",
      unit: "%",
      icon: Battery,
      description: "Stan naładowania",
      details: [
        { label: "Pojemność", value: "1000 kWh" },
        { label: "Cykl życia", value: "95%" },
      ],
    },
    {
      title: "Czas pracy",
      value: "168",
      unit: "h",
      icon: Timer,
      description: "Ciągła praca",
      details: [
        { label: "Od ostatniego resetu", value: "168h" },
        { label: "Do przeglądu", value: "332h" },
      ],
    },
  ],
  energyData: [
    { name: "00:00", consumption: 450, production: 400, efficiency: 89, timestamp: "2024-01-01T00:00:00" },
    { name: "04:00", consumption: 380, production: 350, efficiency: 92, timestamp: "2024-01-01T04:00:00" },
    { name: "08:00", consumption: 650, production: 600, efficiency: 92, timestamp: "2024-01-01T08:00:00" },
    { name: "12:00", consumption: 850, production: 800, efficiency: 94, timestamp: "2024-01-01T12:00:00" },
    { name: "16:00", consumption: 750, production: 700, efficiency: 93, timestamp: "2024-01-01T16:00:00" },
    { name: "20:00", consumption: 550, production: 500, efficiency: 91, timestamp: "2024-01-01T20:00:00" },
    { name: "23:59", consumption: 450, production: 400, efficiency: 89, timestamp: "2024-01-01T23:59:00" },
  ],
};

export const companies = [baseCompany];
