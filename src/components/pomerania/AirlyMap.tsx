
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import 'leaflet/dist/leaflet.css';
import { useMapInitialization } from "./map/useMapInitialization";
import { AirQualityLegend } from "./legend/AirQualityLegend";
import { LoadingOverlay } from "./loading/LoadingOverlay";
import { ErrorOverlay } from "./error/ErrorOverlay";
import { initMapStyles } from "./map/mapStyles";

export function AirlyMap() {
  const { mapRef, isLoading, error, stats } = useMapInitialization();
  
  // Initialize map styles once when component mounts
  useEffect(() => {
    initMapStyles();
  }, []);

  return (
    <Card className="dark:bg-[#1A1F2C] font-['Montserrat'] shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Mapa jakości powietrza - Trójmiasto</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Map container with accessibility attributes */}
        <div 
          className="relative w-full h-[600px] rounded-lg overflow-hidden"
          ref={mapRef}
          role="application"
          aria-label="Mapa jakości powietrza w Trójmieście"
        >
          {isLoading && <LoadingOverlay loaded={stats.loaded} total={stats.total} />}
          {error && <ErrorOverlay message={error} />}
        </div>

        <AirQualityLegend />
      </CardContent>
    </Card>
  );
}
