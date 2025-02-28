
import { SensorCard } from "./SensorCard";

interface SensorGridProps {
  sensors: Array<{
    iconType: string;
    name: string;
    value: string;
    unit: string;
    status: "Good" | "Warning";
    description: string;
  }>;
}

export const SensorGrid = ({ sensors }: SensorGridProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sensors.map((sensor, index) => (
        <SensorCard 
          key={index}
          iconType={sensor.iconType as any}
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
