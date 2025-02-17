
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface AirQualityData {
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  co: number;
  temp: number;
  timestamp: string;
  city: string;
  quality: string;
  pm25_trend?: string;
  pm10_trend?: string;
}

const cities = [
  { name: "Gdańsk", lat: 54.352, lon: 18.6466 },
  { name: "Gdynia", lat: 54.5189, lon: 18.5305 },
  { name: "Sopot", lat: 54.4418, lon: 18.5601 },
  { name: "Słupsk", lat: 54.4641, lon: 17.0285 },
  { name: "Ustka", lat: 54.5805, lon: 16.8614 }
];

export const fetchAirQualityData = async (city: { lat: number; lon: number; name: string }): Promise<AirQualityData> => {
  const apiKey = localStorage.getItem('AIRLY_API_KEY');
  
  if (!apiKey) {
    throw new Error('Brak klucza API Airly. Proszę skonfigurować klucz w ustawieniach.');
  }

  try {
    const response = await fetch(
      `https://airapi.airly.eu/v2/measurements/point?lat=${city.lat}&lng=${city.lon}`,
      {
        headers: {
          'Accept': 'application/json',
          'apikey': apiKey
        }
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('AIRLY_API_KEY');
        throw new Error('Nieprawidłowy klucz API Airly. Sprawdź swój klucz w ustawieniach.');
      }
      throw new Error('Błąd podczas pobierania danych o jakości powietrza');
    }

    const data = await response.json();
    
    const pm25Value = data.current.values.find((v: any) => v.name === 'PM25')?.value || 0;
    const pm10Value = data.current.values.find((v: any) => v.name === 'PM10')?.value || 0;
    
    let quality = "Dobra";
    if (pm25Value > 25 || pm10Value > 50) {
      quality = "Umiarkowana";
    }
    if (pm25Value > 50 || pm10Value > 100) {
      quality = "Zła";
    }

    let temp = data.current.values.find((v: any) => v.name === 'TEMPERATURE')?.value;
    if (temp === undefined) {
      temp = 20;
    } else if (temp > 50 || temp < -50) {
      temp = temp / 10;
    }

    return {
      pm25: pm25Value,
      pm10: pm10Value,
      no2: data.current.values.find((v: any) => v.name === 'NO2')?.value || 0,
      so2: data.current.values.find((v: any) => v.name === 'SO2')?.value || 0,
      o3: data.current.values.find((v: any) => v.name === 'O3')?.value || 0,
      co: data.current.values.find((v: any) => v.name === 'CO')?.value || 0,
      temp: parseFloat(temp.toFixed(1)),
      timestamp: data.current.fromDateTime,
      city: city.name,
      quality: quality,
      pm25_trend: "Stabilny",
      pm10_trend: "Stabilny"
    };
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    throw error;
  }
};

const useAirQualityData = () => {
  return useQuery({
    queryKey: ['airQuality'],
    queryFn: async () => {
      const promises = cities.map(city => fetchAirQualityData(city));
      return Promise.all(promises);
    },
    retry: 1,
    refetchInterval: 300000,
    staleTime: 240000
  });
};

const getQualityColor = (quality: string) => {
  switch (quality) {
    case "Dobra":
      return "#00C853";
    case "Umiarkowana":
      return "#FFD600";
    case "Zła":
      return "#DD2C00";
    default:
      return "#757575";
  }
};

export function PomeranianAirQuality() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const { data, isLoading, error } = useAirQualityData();

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const map = L.map(mapRef.current).setView([54.352, 18.646], 8);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    const bounds = L.latLngBounds(
      [54.8, 16.5],
      [53.9, 19.5]
    );
    map.setMaxBounds(bounds);
    map.setMinZoom(8);

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !data) return;

    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    data.forEach((cityData) => {
      const city = cities.find(c => c.name === cityData.city);
      if (!city) return;

      const markerHtml = `
        <div style="background-color: ${getQualityColor(cityData.quality)}; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: white; min-width: 200px;">
          <div style="font-weight: bold; font-size: 1.125rem; margin-bottom: 0.5rem;">${cityData.city}</div>
          <div style="font-size: 1.875rem; margin-bottom: 0.5rem;">${cityData.quality}</div>
          <div style="margin-bottom: 0.5rem;">Temperatura: ${cityData.temp}°C</div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>PM2.5:</span>
              <span>${cityData.pm25.toFixed(0)} µg/m³ (${cityData.pm25_trend})</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>PM10:</span>
              <span>${cityData.pm10.toFixed(0)} µg/m³ (${cityData.pm10_trend})</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>NO₂:</span>
              <span>${cityData.no2.toFixed(0)} µg/m³</span>
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

      L.marker([city.lat, city.lon], { icon })
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
          {error instanceof Error ? error.message : 'Błąd podczas ładowania danych o jakości powietrza'}
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
              <Card key={cityData.city} className="dark:bg-[#403E43]">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2">{cityData.city}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>PM2.5:</span>
                      <span className="font-medium">
                        {cityData.pm25.toFixed(1)} µg/m³ ({cityData.pm25_trend})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>PM10:</span>
                      <span className="font-medium">
                        {cityData.pm10.toFixed(1)} µg/m³ ({cityData.pm10_trend})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>NO₂:</span>
                      <span className="font-medium">
                        {cityData.no2.toFixed(1)} µg/m³
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>SO₂:</span>
                      <span className="font-medium">
                        {cityData.so2.toFixed(1)} µg/m³
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>O₃:</span>
                      <span className="font-medium">
                        {cityData.o3.toFixed(1)} µg/m³
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>CO:</span>
                      <span className="font-medium">
                        {cityData.co.toFixed(1)} µg/m³
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temperatura:</span>
                      <span className="font-medium">
                        {cityData.temp}°C
                      </span>
                    </div>
                    <div 
                      className="mt-4 p-3 rounded" 
                      style={{ backgroundColor: getQualityColor(cityData.quality) + '20' }}
                    >
                      <div className="font-bold">{cityData.quality}</div>
                      <div>{new Date(cityData.timestamp).toLocaleString()}</div>
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
