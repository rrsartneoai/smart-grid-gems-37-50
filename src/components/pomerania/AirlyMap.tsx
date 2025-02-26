
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchInstallations, fetchMeasurements } from "./airlyService";
import { createMarkerPopup } from "./AirQualityPopup";
import { AirQualityData, Installation, Measurement } from "@/types/company";
import { LatLngExpression, LatLngBounds } from 'leaflet';

// Rate limiting helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Updated map settings to cover both Gdańsk and Gdynia
const MAP_CONFIG = {
  // Center point between Gdańsk and Gdynia
  center: [54.460, 18.5305] as LatLngExpression,
  zoom: 11, // Adjusted zoom to show both cities
  minZoom: 10,
  maxZoom: 18,
  bounds: new LatLngBounds(
    [54.32, 18.45], // Southwest corner
    [54.56, 18.70]  // Northeast corner
  )
};

// Cities coordinates for fetching data
const CITIES = [
  { name: 'Gdańsk', lat: 54.372158, lon: 18.638306 },
  { name: 'Gdynia', lat: 54.5189, lon: 18.5305 }
];

export function AirlyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, loaded: 0 });

  // Function to create a marker for each air quality station
  const createMarker = (data: AirQualityData, map: L.Map) => {
    const { source, current } = data;
    const marker = L.marker([source.location.latitude, source.location.longitude]);

    // Get the air quality index from measurements
    const index = current.indexes?.[0];
    const color = index?.color || '#999999';
    const value = index?.value || 0;

    // Create a custom marker icon with air quality information
    marker.setIcon(L.divIcon({
      className: 'custom-div-icon',
      html: `<div 
        style="
          width: 32px;
          height: 32px;
          background-color: ${color};
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: bold;
        "
        role="img"
        aria-label="Air quality index: ${value}"
      >${Math.round(value)}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    }));

    // Create and bind popup with air quality information
    const popupContent = createMarkerPopup(data);
    marker.bindPopup(popupContent, {
      maxWidth: 400,
      className: 'airly-popup'
    });

    marker.addTo(map);
    return marker;
  };

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
        let allInstallations: Installation[] = [];
        for (const city of CITIES) {
          const installations = await fetchInstallations(city.lat, city.lon);
          allInstallations = [...allInstallations, ...installations];
        }

        setStats({ total: allInstallations.length, loaded: 0 });

        // Process installations in batches to prevent rate limiting
        const batchSize = 5;
        for (let i = 0; i < allInstallations.length; i += batchSize) {
          const batch = allInstallations.slice(i, i + batchSize);
          
          await Promise.all(batch.map(async (installation: Installation) => {
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

              const marker = createMarker(data, map);
              markersRef.current.push(marker);
              setStats(prev => ({ ...prev, loaded: prev.loaded + 1 }));
            } catch (error) {
              console.error(`Error processing installation ${installation.id}:`, error);
            }
          }));

          // Add delay between batches
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
          {/* Loading overlay */}
          {isLoading && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              role="alert"
              aria-busy="true"
            >
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <div className="text-sm text-gray-500">
                  Ładowanie czujników... ({stats.loaded}/{stats.total})
                </div>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div 
              className="absolute inset-0 flex items-center justify-center"
              role="alert"
            >
              <div className="text-red-500 text-center p-4 bg-background/95 rounded-lg">
                <div className="font-bold mb-2">Błąd</div>
                <div>{error}</div>
              </div>
            </div>
          )}
        </div>

        {/* Legend and information */}
        <div className="mt-4 space-y-2">
          <div className="text-sm text-muted-foreground">
            Kliknij w znacznik na mapie, aby zobaczyć szczegółowe informacje o jakości powietrza.
            Kolor znacznika odpowiada jakości powietrza w danym miejscu.
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#34D399] mr-1"></span>
              Bardzo dobra
            </span>
            <span className="inline-flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#FBBF24] mr-1"></span>
              Dobra
            </span>
            <span className="inline-flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#F59E0B] mr-1"></span>
              Umiarkowana
            </span>
            <span className="inline-flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#EF4444] mr-1"></span>
              Zła
            </span>
          </div>
        </div>
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
