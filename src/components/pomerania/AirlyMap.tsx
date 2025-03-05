
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG } from "./config/mapConfig";
import { AirQualityLegend } from "./legend/AirQualityLegend";
import { LoadingOverlay } from "./loading/LoadingOverlay";
import { ErrorOverlay } from "./error/ErrorOverlay";
import { createAirQualityMarker } from "./markers/AirQualityMarker";

// Static AQICN station data for Tricity area
const AQICN_STATIONS = [
  {
    id: "gdynia-pogorze",
    name: "Gdynia Pogórze",
    address: { street: "Pogórze" },
    location: { latitude: 54.561, longitude: 18.493 },
    current: {
      indexes: [{ value: 43, color: "#FFFF00", description: "Umiarkowana", advice: "Osoby wrażliwe powinny ograniczyć przebywanie na zewnątrz" }],
      pm25: 21.5,
      pm10: 28.3,
      o3: 87.2,
      no2: 5.8,
      so2: 3.1,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "sopot",
    name: "Sopot",
    address: { street: "Bitwy pod Płowcami" },
    location: { latitude: 54.441, longitude: 18.562 },
    current: {
      indexes: [{ value: 32, color: "#9ACD32", description: "Dobra", advice: "Jakość powietrza jest zadowalająca" }],
      pm25: 15.8,
      pm10: 21.6,
      o3: 75.4,
      no2: 8.2,
      so2: 2.7,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdansk-srodmiescie",
    name: "Gdańsk Śródmieście",
    address: { street: "Śródmieście" },
    location: { latitude: 54.353, longitude: 18.647 },
    current: {
      indexes: [{ value: 38, color: "#FFFF00", description: "Umiarkowana", advice: "Jakość powietrza jest akceptowalna" }],
      pm25: 18.9,
      pm10: 24.7,
      o3: 81.3,
      no2: 12.5,
      so2: 3.5,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdansk-stogi",
    name: "Gdańsk Stogi",
    address: { street: "Stogi" },
    location: { latitude: 54.358, longitude: 18.693 },
    current: {
      indexes: [{ value: 45, color: "#FFFF00", description: "Umiarkowana", advice: "Ograniczenie aktywności na zewnątrz dla wrażliwych osób" }],
      pm25: 22.4,
      pm10: 29.8,
      o3: 72.1,
      no2: 15.7,
      so2: 4.3,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdansk-wrzeszcz",
    name: "Gdańsk Wrzeszcz",
    address: { street: "Wrzeszcz" },
    location: { latitude: 54.378, longitude: 18.620 },
    current: {
      indexes: [{ value: 35, color: "#9ACD32", description: "Dobra", advice: "Jakość powietrza jest zadowalająca" }],
      pm25: 17.2,
      pm10: 22.9,
      o3: 79.5,
      no2: 9.8,
      so2: 3.2,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdansk-nowy-port",
    name: "Gdańsk Nowy Port",
    address: { street: "Nowy Port" },
    location: { latitude: 54.400, longitude: 18.665 },
    current: {
      indexes: [{ value: 40, color: "#FFFF00", description: "Umiarkowana", advice: "Jakość powietrza jest akceptowalna" }],
      pm25: 19.8,
      pm10: 26.3,
      o3: 73.8,
      no2: 13.4,
      so2: 3.9,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdynia-srodmiescie",
    name: "Gdynia Śródmieście",
    address: { street: "Śródmieście" },
    location: { latitude: 54.518, longitude: 18.531 },
    current: {
      indexes: [{ value: 33, color: "#9ACD32", description: "Dobra", advice: "Brak ograniczeń" }],
      pm25: 16.5,
      pm10: 22.1,
      o3: 82.7,
      no2: 7.6,
      so2: 2.9,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdynia-dabrowa",
    name: "Gdynia Dąbrowa",
    address: { street: "Dąbrowa" },
    location: { latitude: 54.474, longitude: 18.475 },
    current: {
      indexes: [{ value: 37, color: "#FFFF00", description: "Umiarkowana", advice: "Jakość powietrza jest akceptowalna" }],
      pm25: 18.4,
      pm10: 24.1,
      o3: 76.9,
      no2: 8.9,
      so2: 3.1,
      fromDateTime: new Date().toISOString()
    }
  }
];

export function AirlyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: AQICN_STATIONS.length, loaded: 0 });

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      setIsLoading(true);
      setError(null);
      setStats({ total: AQICN_STATIONS.length, loaded: 0 });

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
          attribution: '©OpenStreetMap, ©CartoDB, ©AQICN',
          subdomains: 'abcd',
          className: 'dark-map-tiles'
        }).addTo(map);

        // Add zoom control to bottom right
        L.control.zoom({
          position: 'bottomright'
        }).addTo(map);

        mapInstance.current = map;
        console.log('Map initialized successfully');

        // Process static AQICN station data
        for (const station of AQICN_STATIONS) {
          try {
            const data = {
              source: {
                id: `aqicn-${station.id}`,
                name: `${station.name} ${station.address?.street || ''}`,
                provider: 'AQICN',
                location: station.location
              },
              current: {
                ...station.current,
                provider: 'AQICN',
                timestamp: station.current.fromDateTime
              }
            };

            const marker = createAirQualityMarker(data, map);
            markersRef.current.push(marker);
            setStats(prev => ({ ...prev, loaded: prev.loaded + 1 }));
          } catch (error) {
            console.error(`Error processing station ${station.id}:`, error);
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
