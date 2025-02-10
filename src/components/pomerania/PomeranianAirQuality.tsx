
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
const TROJMIASTO_LOCATIONS = [
  { name: "Gdańsk", lat: 54.352, lon: 18.646 },
  { name: "Gdynia", lat: 54.518, lon: 18.531 },
  { name: "Sopot", lat: 54.441, lon: 18.560 }
];

export function PomeranianAirQuality() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView([54.372158, 18.638306], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
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
        TROJMIASTO_LOCATIONS.map(async (location) => {
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
      const { location } = cityData;
      const airQualityIndex = cityData.current.indexes[0];

      const markerHtml = `
        <div class="flex flex-col items-center p-2 bg-white rounded shadow">
          <div class="w-4 h-4 rounded-full mb-1" style="background-color: ${airQualityIndex.color}"></div>
          <div class="font-bold">${location.name}</div>
          <div>${airQualityIndex.description}</div>
          <div>CAQI: ${airQualityIndex.value.toFixed(0)}</div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: markerHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
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
      <Card>
        <CardHeader>
          <CardTitle>Jakość powietrza w Trójmieście</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[500px] rounded-lg overflow-hidden mb-6" ref={mapRef} />
          
          <div className="grid gap-4 md:grid-cols-3">
            {data && data.map((cityData) => (
              <Card key={cityData.location.name}>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2">{cityData.location.name}</h3>
                  <div className="space-y-2">
                    {cityData.current.values.map((measurement) => (
                      <div key={measurement.name} className="flex justify-between">
                        <span>{measurement.name}:</span>
                        <span className="font-medium">{measurement.value.toFixed(1)}</span>
                      </div>
                    ))}
                    <div className="mt-4 p-3 rounded" style={{ backgroundColor: cityData.current.indexes[0].color + '20' }}>
                      <div className="font-bold">{cityData.current.indexes[0].description}</div>
                      <div>CAQI: {cityData.current.indexes[0].value.toFixed(0)}</div>
                    </div>
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
