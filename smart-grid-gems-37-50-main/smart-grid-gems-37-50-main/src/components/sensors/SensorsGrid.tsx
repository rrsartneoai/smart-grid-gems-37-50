
import { SensorCard } from "./SensorCard";
import { SensorData } from "./SensorsData";

interface SensorsGridProps {
  sensors: SensorData[];
}

export const SensorsGrid = ({ sensors }: SensorsGridProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sensors.map((sensor, index) => (
        <SensorCard 
          key={index}
          iconType={sensor.iconType}
          name={sensor.name}
          value={sensor.value}
          unit={sensor.unit}
          status={sensor.status}
          description={sensor.description}
        />
      ))}
    </div>
  );
};
