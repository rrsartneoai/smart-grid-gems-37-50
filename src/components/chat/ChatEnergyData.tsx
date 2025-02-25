import { useCompanyStore } from "@/components/CompanySidebar";
import { companies } from "@/data/companies";

interface ChatEnergyDataProps {
  dataType: "consumption" | "production" | "efficiency" | "airQuality" | "temperature" | "humidity";
  title: string;
}

export function ChatEnergyData({ dataType, title }: ChatEnergyDataProps) {
  const { selectedCompanyId } = useCompanyStore();
  const selectedCompany = companies.find(
    (company) => company.id === selectedCompanyId
  );

  if (!selectedCompany) {
    return <p>No company selected.</p>;
  }

  let dataValue: number | undefined;
  let unit: string | undefined;

  switch (dataType) {
    case "consumption":
      dataValue = selectedCompany.energyData.reduce((sum, data) => sum + data.consumption, 0);
      unit = "MWh";
      break;
    case "production":
      dataValue = selectedCompany.energyData.reduce((sum, data) => sum + data.production, 0);
      unit = "MWh";
      break;
    case "efficiency":
      dataValue = selectedCompany.energyData.reduce((sum, data) => sum + data.efficiency, 0) / selectedCompany.energyData.length;
      unit = "%";
      break;
    case "airQuality":
      dataValue = 50; // Example value
      unit = "AQI";
      break;
    case "temperature":
      dataValue = 25; // Example value
      unit = "°C";
      break;
    case "humidity":
      dataValue = 60; // Example value
      unit = "%";
      break;
    default:
      dataValue = undefined;
      unit = undefined;
  }

  return (
    <div>
      <p>{title}:</p>
      {dataValue !== undefined ? (
        <p>
          {dataValue.toFixed(2)} {unit}
        </p>
      ) : (
        <p>Data not available</p>
      )}
    </div>
  );
}
