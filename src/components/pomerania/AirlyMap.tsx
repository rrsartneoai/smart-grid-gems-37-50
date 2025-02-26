
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchInstallations, fetchMeasurements } from "./airlyService";
import { AirQualityData, Installation } from "@/types/company";
import { MAP_CONFIG, CITIES } from "./config/mapConfig";
import { createAirQualityMarker } from "./markers/AirQualityMarker";
import { AirQualityLegend } from "./legend/AirQualityLegend";
import { LoadingOverlay } from "./loading/LoadingOverlay";
import { ErrorOverlay } from "./error/ErrorOverlay";

// Rate limiting helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function AirlyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, loaded: 0 });

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      setIsLoading(true);
      setError(null);
      setStats({ total: 0, loaded: 0 });

      try {
        // Initialize the map
        console.log('Initializing map...');
        const map = L.map(mapRef.current, {
          center: MAP_CONFIG.center,
          zoom: MAP_CONFIG.zoom,
          minZoom: MAP_CONFIG.minZoom,
          maxZoom: MAP_CONFIG.maxZoom,
          zoomControl: false,
          attributionControl: true
        });

        // Set bounds to restrict the view to Tricity area
        map.setMaxBounds(MAP_CONFIG.bounds);

        // Add a dark theme map layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '©OpenStreetMap, ©CartoDB, ©Airly',
          subdomains: 'abcd',
          className: 'dark-map-tiles'
        }).addTo(map);

        // Add zoom control to bottom right
        L.control.zoom({
          position: 'bottomright'
        }).addTo(map);

        mapInstance.current = map;
        console.log('Map initialized successfully');

        // Fetch installations for all cities
        const fetchedInstallations = await Promise.all(
          CITIES.map(city => fetchInstallations(city.lat, city.lon))
        );
        
        // Flatten and deduplicate installations by ID
        const allInstallations = Array.from(
          new Map(
            fetchedInstallations
              .flat()
              .map(install => [install.id, install])
          ).values()
        );

        setStats({ total: allInstallations.length, loaded: 0 });

        // Process installations in batches to prevent rate limiting
        const batchSize = 5;
        for (let i = 0; i < allInstallations.length; i += batchSize) {
          const batch = allInstallations.slice(i, i + batchSize);
          
          await Promise.all(batch.map(async (installation) => {
            try {
              console.log(`Fetching data for installation ${installation.id}...`);
              const measurements = await fetchMeasurements(installation.id);
              
              const data: AirQualityData = {
                source: {
                  id: `airly-${installation.id}`,
                  name: `Airly ${installation.location.address?.street || ''}`,
                  provider: 'Airly',
                  location: installation.location
                },
                current: {
                  ...measurements.current,
                  provider: 'Airly',
                  timestamp: measurements.current.fromDateTime
                }
              };

              const marker = createAirQualityMarker(data, map);
              markersRef.current.push(marker);
              setStats(prev => ({ ...prev, loaded: prev.loaded + 1 }));
            } catch (error) {
              console.error(`Error processing installation ${installation.id}:`, error);
            }
          }));

          if (i + batchSize < allInstallations.length) {
            await delay(500);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Wystąpił błąd podczas ładowania danych. Spróbuj odświeżyć stronę.');
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (mapInstance.current) {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
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

// Add global styles for the map
const style = document.createElement('style');
style.textContent = `
  .leaflet-popup-content-wrapper {
    background: rgba(26, 31, 44, 0.95);
    color: white;
    border-radius: 12px;
    backdrop-filter: blur(8px);
  }

  .leaflet-popup-tip {
    background: rgba(26, 31, 44, 0.95);
  }

  .leaflet-container {
    font-family: 'Montserrat', sans-serif;
  }

  .dark-map-tiles {
    filter: brightness(0.8) saturate(1.2);
  }

  .airly-popup .leaflet-popup-content {
    margin: 0;
    min-width: 280px;
  }

  @media (max-width: 640px) {
    .airly-popup .leaflet-popup-content {
      min-width: 240px;
    }
  }
`;
document.head.appendChild(style);

