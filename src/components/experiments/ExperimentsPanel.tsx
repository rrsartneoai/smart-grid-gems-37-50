import { WeatherPanel } from "@/components/weather/WeatherPanel";
import { EnergyCard } from "./EnergyCard";
import { ChargingStationsCard } from "./charging/ChargingStationsCard";

export const ExperimentsPanel = () => {
  return (
    <div className="space-y-6">
      <WeatherPanel />
      <EnergyCard />
      <ChargingStationsCard />
    </div>
  );
};