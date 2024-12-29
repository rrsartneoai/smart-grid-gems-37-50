import { WeatherPanel } from "@/components/weather/WeatherPanel";
import { EnergyCard } from "./EnergyCard";

export const ExperimentsPanel = () => {
  return (
    <div className="space-y-6">
      <WeatherPanel />
      <EnergyCard />
    </div>
  );
};