
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
  { name: "Warszawa", lat: 52.229, lon: 21.012 },
  { name: "Kraków", lat: 50.064, lon: 19.944 },
  { name: "Wrocław", lat: 51.107, lon: 17.038 }
];

export function PomeranianAirQuality() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map centered on Poland
    mapInstance.current = L.map(mapRef.current).setView([52.069, 19.480], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // Dodaj kontrolki zoom
    L.control.zoom({
      position: 'bottomright'
    }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

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

  useEffect(() => {
    if (!mapInstance.current || !data) return;

    // Clear existing markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    // Add markers for each location
    data.forEach((cityData) => {
      if (!cityData?.current?.indexes?.[0]) return;
      
      const { location } = cityData;
      const airQualityIndex = cityData.current.indexes[0];
      const pm10Value = cityData.current.values.find(v => v.name === 'PM10')?.value;
      const pm25Value = cityData.current.values.find(v => v.name === 'PM25')?.value;
      const pm1Value = cityData.current.values.find(v => v.name === 'PM1')?.value;

      const markerHtml = `
        <div class="bg-[${airQualityIndex.color}] p-4 rounded-lg shadow-lg text-white min-w-[200px]">
          <div class="font-bold text-lg mb-2">${location.name}</div>
          <div class="text-3xl mb-2">${airQualityIndex.value?.toFixed(0) || 'N/A'}</div>
          <div class="mb-2">${airQualityIndex.description}</div>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span>PM10:</span>
              <span>${pm10Value?.toFixed(0) || 'N/A'} µg/m³</span>
            </div>
            <div class="flex justify-between items-center">
              <span>PM2.5:</span>
              <span>${pm25Value?.toFixed(0) || 'N/A'} µg/m³</span>
            </div>
            <div class="flex justify-between items-center">
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
          <CardTitle>Mapa jakości powietrza w Polsce</CardTitle>
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
