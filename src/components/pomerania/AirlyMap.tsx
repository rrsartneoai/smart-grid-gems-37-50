
import { Card, CardContent } from "@/components/ui/card";
import 'leaflet/dist/leaflet.css';
import { useMapInitialization } from "./map/useMapInitialization";
import { AirQualityLegend } from "./legend/AirQualityLegend";
import { MapContainer } from "./map/MapContainer";
import { MapHeader } from "./map/MapHeader";
import { useMapStyles } from "./map/useMapStyles";

export function AirlyMap() {
  const { mapRef, isLoading, error, stats } = useMapInitialization();
  useMapStyles();

  return (
    <Card className="dark:bg-[#1A1F2C] font-['Montserrat'] shadow-lg">
      <MapHeader title="Mapa jakości powietrza - Trójmiasto" />
      <CardContent>
        <MapContainer 
          mapRef={mapRef}
          isLoading={isLoading}
          error={error}
          stats={stats}
        />
        <AirQualityLegend />
      </CardContent>
    </Card>
  );
}
