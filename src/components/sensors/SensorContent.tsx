
import { SensorGrid } from "./SensorGrid";
import { AlertsConfig } from "./AlertsConfig";
import { DataComparison } from "./DataComparison";
import { AirQualityChart } from "../dashboard/AirQualityChart";
import { SensorDetails } from "./SensorDetails";

interface SensorContentProps {
  currentCityData: any;
  filteredSensors: Array<{
    iconType: string;
    name: string;
    value: string;
    unit: string;
    status: "Good" | "Warning";
    description: string;
  }>;
}

export const SensorContent = ({ currentCityData, filteredSensors }: SensorContentProps) => {
  if (!currentCityData) return null;

  return (
    <>
      <SensorGrid sensors={filteredSensors} />

      <div className="mt-8 space-y-8">
        <AlertsConfig />
        <DataComparison />
        <AirQualityChart />
        <SensorDetails currentCityData={currentCityData} />
      </div>
    </>
  );
};
