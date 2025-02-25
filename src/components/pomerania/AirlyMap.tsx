
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchInstallations, fetchMeasurements } from "./airlyService";
import { createMarkerPopup } from "./AirQualityPopup";

export function AirlyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      console.error('Map reference is not available');
      return;
    }

    const initializeMap = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Initializing map...');
        const map = L.map(mapRef.current).setView([54.34854, 18.64966], 11);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.control.zoom({
          position: 'bottomright'
        }).addTo(map);

        mapInstance.current = map;
        console.log('Map initialized successfully');

        console.log('Fetching installations...');
        const installations = await fetchInstallations(54.34854, 18.64966);
        console.log(`Fetched ${installations.length} installations`);

        let addedMarkers = 0;
        for (const installation of installations) {
          try {
            console.log(`Fetching measurements for installation ${installation.id}...`);
            const measurements = await fetchMeasurements(installation.id);
            
            const marker = L.marker([
              installation.location.latitude,
              installation.location.longitude
            ]);

            const popupContent = createMarkerPopup(installation, measurements);
            marker.bindPopup(popupContent);
            
            const index = measurements.current.indexes[0];
            if (index) {
              marker.setIcon(L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="
                  width: 24px;
                  height: 24px;
                  background-color: ${index.color};
                  border-radius: 50%;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              }));
            }

            marker.addTo(map);
            addedMarkers++;
          } catch (error) {
            console.error(`Error processing installation ${installation.id}:`, error);
          }
        }

        console.log(`Successfully added ${addedMarkers} markers to the map`);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Wystąpił błąd podczas ładowania danych');
        setIsLoading(false);
      }
    };

    // Small delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      initializeMap().catch((error) => {
        console.error('Unhandled error in initializeMap:', error);
        setError('Wystąpił nieoczekiwany błąd');
        setIsLoading(false);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        console.log('Map instance cleaned up');
      }
    };
  }, []);

  return (
    <Card className="dark:bg-[#1A1F2C]">
      <CardHeader>
        <CardTitle>Mapa czujników Airly - Trójmiasto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[600px] rounded-lg overflow-hidden relative" ref={mapRef}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-500">{error}</div>
            </div>
          )}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Dane pochodzą z czujników Airly. Kliknij w znacznik na mapie, aby zobaczyć szczegółowe informacje o jakości powietrza.
          Kolor znacznika odpowiada jakości powietrza w danym miejscu.
        </div>
      </CardContent>
    </Card>
  );
}
