import { Company } from "@/types/company";
import { Activity, Battery, Cpu, DollarSign, Flame, Gauge, Power, Timer, Wifi, Zap } from "lucide-react";

export const ekoEnergiaPlus: Company = {
  id: "2",
  name: "EkoEnergia Plus",
  stats: [
    {
      title: "Energy Usage",
      value: "420",
      unit: "kWh",
      icon: Power,
      description: "Current energy consumption",
      details: [
        { label: "Peak Today", value: "450 kWh" },
        { label: "Average", value: "380 kWh" },
      ],
    },
    {
      title: "Battery Level",
      value: "78",
      unit: "%",
      icon: Battery,
      description: "Current storage capacity",
      details: [
        { label: "Capacity", value: "100 kWh" },
        { label: "Time Left", value: "4.5 hours" },
      ],
    },
    {
      title: "System Performance",
      value: "92",
      unit: "%",
      icon: Gauge,
      description: "Overall system efficiency",
      details: [
        { label: "Peak", value: "98%" },
        { label: "Average", value: "89%" },
      ],
    },
    {
      title: "Network Status",
      value: "95",
      unit: "%",
      icon: Wifi,
      description: "Connection stability",
      details: [
        { label: "Uptime", value: "99.9%" },
        { label: "Latency", value: "45ms" },
      ],
    }
  ],
  energyData: [
    {
      name: "Solar",
      consumption: 180,
      production: 220,
      efficiency: 95,
      timestamp: "2024-01-01T12:00:00Z",
    },
    {
      name: "Wind",
      consumption: 120,
      production: 150,
      efficiency: 90,
      timestamp: "2024-01-01T12:00:00Z",
    },
    {
      name: "Battery",
      consumption: 80,
      production: 100,
      efficiency: 85,
      timestamp: "2024-01-01T12:00:00Z",
    },
    {
      name: "Grid",
      consumption: 40,
      production: 0,
      efficiency: 0,
      timestamp: "2024-01-01T12:00:00Z",
    }
  ],
};
