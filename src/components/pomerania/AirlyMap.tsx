
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchInstallations, fetchMeasurements } from "./airlyService";
import { createMarkerPopup } from "./AirQualityPopup";

// Rate limiting helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
        const map = L.map(mapRef.current).setView([54.372158, 18.638306], 12);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '©OpenStreetMap, ©CartoDB',
          subdomains: 'abcd'
        }).addTo(map);

        L.control.zoom({
          position: 'bottomright'
        }).addTo(map);

        mapInstance.current = map;
        console.log('Map initialized successfully');

        const cities = [
          { lat: 54.372158, lng: 18.638306 }, // Gdańsk
          { lat: 54.441581, lng: 18.560096 }, // Sopot
          { lat: 54.518889, lng: 18.531889 }  // Gdynia
        ];

        let allInstallations = [];
        for (const city of cities) {
          const installations = await fetchInstallations(city.lat, city.lng);
          allInstallations.push(...installations);
          // Add delay between city requests
          await delay(100);
        }

        const uniqueInstallations = Array.from(new Map(
          allInstallations.map(item => [item.id, item])
        ).values());

        console.log(`Fetched ${uniqueInstallations.length} unique installations`);

        let addedMarkers = 0;
        // Process installations in smaller batches to prevent rate limiting
        const batchSize = 5;
        for (let i = 0; i < uniqueInstallations.length; i += batchSize) {
          const batch = uniqueInstallations.slice(i, i + batchSize);
          
          await Promise.all(batch.map(async (installation) => {
            try {
              console.log(`Fetching measurements for installation ${installation.id}...`);
              const measurements = await fetchMeasurements(installation.id);
              
              const marker = L.marker([
                installation.location.latitude,
                installation.location.longitude
              ]);

              const popupContent = createMarkerPopup(installation, measurements);
              marker.bindPopup(popupContent, {
                maxWidth: 400,
                className: 'airly-popup'
              });
              
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
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-family: Montserrat, sans-serif;
                    font-size: 10px;
                    font-weight: bold;
                  ">${Math.round(index.value)}</div>`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                }));
              }

              marker.addTo(map);
              addedMarkers++;
            } catch (error) {
              console.error(`Error processing installation ${installation.id}:`, error);
            }
          }));

          // Add delay between batches
          if (i + batchSize < uniqueInstallations.length) {
            await delay(500);
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
    <Card className="dark:bg-[#1A1F2C] font-['Montserrat']">
      <CardHeader>
        <CardTitle className="text-xl">Mapa czujników Airly - Trójmiasto</CardTitle>
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
