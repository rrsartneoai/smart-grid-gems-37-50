import { Company } from "@/types/company";

export const companies: Company[] = [
  {
    id: "1",
    name: "EcoTech Innovations",
    stats: [
      {
        title: "Energy Consumption",
        value: "350",
        unit: "MWh",
        icon: require('lucide-react').Flame,
        description: "Total energy consumed this month",
        details: [
          { label: "Previous Month", value: "380 MWh" },
          { label: "Year Average", value: "365 MWh" },
        ],
      },
      {
        title: "Renewable Energy",
        value: "60",
        unit: "%",
        icon: require('lucide-react').Sun,
        description: "Percentage of energy from renewable sources",
        details: [
          { label: "Target", value: "75%" },
          { label: "Last Year", value: "50%" },
        ],
      },
      {
        title: "Carbon Footprint",
        value: "120",
        unit: "Tons",
        icon: require('lucide-react').Cloud,
        description: "Total carbon emissions this month",
        details: [
          { label: "Previous Month", value: "130 Tons" },
          { label: "Year Target", value: "110 Tons" },
        ],
      },
      {
        title: "Waste Recycled",
        value: "85",
        unit: "%",
        icon: require('lucide-react').Recycle,
        description: "Percentage of waste recycled",
        details: [
          { label: "Target", value: "90%" },
          { label: "Last Year", value: "80%" },
        ],
      },
    ],
    energyData: [
      {
        name: "Solar",
        consumption: 150,
        production: 200,
        efficiency: 92,
        timestamp: "2024-01-01T12:00:00Z",
      },
      {
        name: "Wind",
        consumption: 100,
        production: 120,
        efficiency: 88,
        timestamp: "2024-01-01T12:00:00Z",
      },
      {
        name: "Grid",
        consumption: 100,
        production: 0,
        efficiency: 0,
        timestamp: "2024-01-01T12:00:00Z",
      },
    ],
  },
];
