
import { AirlyMap } from "./AirlyMap";
import { AirQualitySpaces } from "./AirQualitySpaces";

export const PomeranianAirQuality = () => {
  return (
    <div className="space-y-6">
      <AirlyMap />
      <AirQualitySpaces />
    </div>
  );
};
