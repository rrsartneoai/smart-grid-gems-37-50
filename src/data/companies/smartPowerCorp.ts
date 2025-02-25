
import { Company } from "@/types/company";
import { Activity, Battery, Cpu, DollarSign } from "lucide-react";

export const smartPowerCorp: Company = {
  id: "6",
  name: "SmartPower Corp",
  stats: [
    {
      title: "System Performance",
      value: "98.5",
      unit: "%",
      icon: Activity,
      description: "Overall system efficiency",
      details: [
        { label: "Uptime", value: "99.9%" },
        { label: "Response Time", value: "45ms" },
      ],
    },
    {
      title: "Battery Storage",
      value: "75",
      unit: "%",
      icon: Battery,
      description: "Current battery charge level",
      details: [
        { label: "Capacity", value: "500 kWh" },
        { label: "Discharge Rate", value: "50 kW" },
      ],
    },
    {
      title: "Processing Load",
      value: "65",
      unit: "%",
      icon: Cpu,
      description: "Current CPU utilization",
      details: [
        { label: "Threads", value: "24/32" },
        { label: "Memory", value: "85%" },
      ],
    },
    {
      title: "Cost Savings",
      value: "12500",
      unit: "PLN",
      icon: DollarSign,
      description: "Monthly cost reduction",
      details: [
        { label: "Previous", value: "15000 PLN" },
        { label: "Target", value: "10000 PLN" },
      ],
    },
  ],
  energyData: [
    {
      name: "Processing",
      consumption: 120,
      production: 0,
      efficiency: 95,
      timestamp: "2024-01-01T12:00:00Z",
    },
    {
      name: "Storage",
      consumption: 50,
      production: 200,
      efficiency: 92,
      timestamp: "2024-01-01T12:00:00Z",
    },
    {
      name: "Distribution",
      consumption: 30,
      production: 180,
      efficiency: 88,
      timestamp: "2024-01-01T12:00:00Z",
    },
  ],
};
