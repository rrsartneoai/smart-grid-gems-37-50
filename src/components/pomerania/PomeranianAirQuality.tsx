
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface AirQualityData {
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  current: {
    values: Array<{
      name: string;
      value: number;
    }>;
    indexes: Array<{
      value: number;
      level: string;
      description: string;
      color: string;
    }>;
  };
}

const AIRLY_API_KEY = "zORU0m4cOxlElF9X4YcvhaR3sfiiqgFP";
const LOCATIONS = [
  { name: "Gdańsk", lat: 54.352, lon: 18.646 },
  { name: "Gdynia", lat: 54.518, lon: 18.531 },
  { name: "Sopot", lat: 54.441, lon: 18.560 },
  { name: "Słupsk", lat: 54.464, lon: 17.029 },
  { name: "Ustka", lat: 54.580, lon: 16.861 }
];

export function PomeranianAirQuality() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  const { data, isLoading, error } = useQuery<AirQualityData[]>({
    queryKey: ['airlyData'],
    queryFn: async () => {
      const results = await Promise.all(
        LOCATIONS.map(async (location) => {
          const response = await fetch(
            `https://airapi.airly.eu/v2/measurements/point?lat=${location.lat}&lng=${location.lon}`,
            {
              headers: {
                'Accept': 'application/json',
                'apikey': AIRLY_API_KEY,
              },
            }
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          return { ...data, location };
        })
      );
      return results;
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Cleanup previous map instance if it exists
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    // Create new map instance centered on Pomorskie
    const map = L.map(mapRef.current).setView([54.352, 18.646], 8);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Set map bounds to Pomorskie region
    const bounds = L.latLngBounds(
      [54.8, 16.5], // Southwest corner
      [53.9, 19.5]  // Northeast corner
    );
    map.setMaxBounds(bounds);
    map.setMinZoom(8);

    mapInstance.current = map;

    // Cleanup on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstance.current || !data) return;

    // Clear existing markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    // Add new markers
    data.forEach((cityData) => {
      if (!cityData?.current?.indexes?.[0]) return;
      
      const { location } = cityData;
      const airQualityIndex = cityData.current.indexes[0];
      const pm10Value = cityData.current.values.find(v => v.name === 'PM10')?.value;
      const pm25Value = cityData.current.values.find(v => v.name === 'PM25')?.value;
      const pm1Value = cityData.current.values.find(v => v.name === 'PM1')?.value;

      const markerHtml = `
        <div style="background-color: ${airQualityIndex.color}; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: white; min-width: 200px;">
          <div style="font-weight: bold; font-size: 1.125rem; margin-bottom: 0.5rem;">${location.name}</div>
          <div style="font-size: 1.875rem; margin-bottom: 0.5rem;">${airQualityIndex.value?.toFixed(0) || 'N/A'}</div>
          <div style="margin-bottom: 0.5rem;">${airQualityIndex.description}</div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>PM10:</span>
              <span>${pm10Value?.toFixed(0) || 'N/A'} µg/m³</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>PM2.5:</span>
              <span>${pm25Value?.toFixed(0) || 'N/A'} µg/m³</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>PM1:</span>
              <span>${pm1Value?.toFixed(0) || 'N/A'} µg/m³</span>
            </div>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: markerHtml,
        iconSize: [200, 120],
        iconAnchor: [100, 60]
      });

      L.marker([location.lat, location.lon], { icon })
        .addTo(mapInstance.current!);
    });
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-red-500">
          Błąd podczas ładowania danych o jakości powietrza
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="dark:bg-[#1A1F2C]">
        <CardHeader>
          <CardTitle>Mapa jakości powietrza - województwo pomorskie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] rounded-lg overflow-hidden mb-6" ref={mapRef} />
          
          <div className="grid gap-4 md:grid-cols-3">
            {Array.isArray(data) && data.map((cityData) => (
              <Card key={cityData.location.name} className="dark:bg-[#403E43]">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2">{cityData.location.name}</h3>
                  <div className="space-y-2">
                    {cityData.current.values.map((measurement) => (
                      <div key={measurement.name} className="flex justify-between">
                        <span>{measurement.name}:</span>
                        <span className="font-medium">
                          {measurement.value?.toFixed(1) ?? 'N/A'} µg/m³
                        </span>
                      </div>
                    ))}
                    {cityData.current.indexes[0] && (
                      <div 
                        className="mt-4 p-3 rounded" 
                        style={{ backgroundColor: cityData.current.indexes[0].color + '20' }}
                      >
                        <div className="font-bold">{cityData.current.indexes[0].description}</div>
                        <div>CAQI: {cityData.current.indexes[0].value?.toFixed(0) ?? 'N/A'}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
