
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AirlyMap } from "./airly-map/AirlyMap";
import { AirQualitySpaces } from "./AirQualitySpaces";

export const PomeranianAirQuality = () => {
  return (
    <div className="space-y-6">
      <AirlyMap />
      <AirQualitySpaces />
    </div>
  );
};
