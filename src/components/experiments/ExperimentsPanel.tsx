import { ChargingStationsCard } from "./charging/ChargingStationsCard";
import { BikeStationsCard } from "./bikes/BikeStationsCard";

export const ExperimentsPanel = () => {
  return (
    <div className="space-y-8">
      <ChargingStationsCard />
      <BikeStationsCard />
    </div>
  );
};
