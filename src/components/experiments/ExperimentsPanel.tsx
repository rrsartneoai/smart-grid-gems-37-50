import { WeatherPanel } from "@/components/weather/WeatherPanel";
import { FranceEnergyCard } from "./FranceEnergyCard";

export const ExperimentsPanel = () => {
  return (
    <div className="space-y-6">
      <WeatherPanel />
      <FranceEnergyCard />
    </div>
  );
};