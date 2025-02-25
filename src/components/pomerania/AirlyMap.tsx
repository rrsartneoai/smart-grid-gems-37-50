
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Installation {
  id: number;
  location: {
    latitude: number;
    longitude: number;
  };
  address: {
    streetNumber?: string;
    street?: string;
    city?: string;
  };
}

interface Measurement {
  current: {
    fromDateTime: string;
    tillDateTime: string;
    values: Array<{
      name: string;
      value: number;
    }>;
    indexes: Array<{
      name: string;
      value: number;
      level: string;
      description: string;
      advice: string;
      color: string;
    }>;
  };
}

export function AirlyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiKey = 'zORU0m4cOxlElF9X4YcvhaR3sfiiqgFP';

  const fetchInstallations = async (lat: number, lng: number): Promise<Installation[]> => {
    try {
      const response = await fetch(
        `https://airapi.airly.eu/v2/installations/nearest?lat=${lat}&lng=${lng}&maxDistanceKM=10&maxResults=100`,
        {
          headers: {
            'Accept': 'application/json',
            'apikey': apiKey
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Nie udało się pobrać danych o czujnikach');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching installations:', error);
      throw error;
    }
  };

  const fetchMeasurements = async (installationId: number): Promise<Measurement> => {
    try {
      const response = await fetch(
        `https://airapi.airly.eu/v2/measurements/installation?installationId=${installationId}`,
        {
          headers: {
            'Accept': 'application/json',
            'apikey': apiKey
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Nie udało się pobrać pomiarów');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching measurements:', error);
      throw error;
    }
  };

  const createMarkerPopup = (installation: Installation, measurements: Measurement) => {
    const getValue = (name: string) => {
      const value = measurements.current.values.find(v => v.name === name)?.value;
      return value !== undefined ? value.toFixed(1) : 'brak danych';
    };

    const index = measurements.current.indexes[0];
    const color = index?.color || '#gray';
    const quality = index?.description || 'Brak danych';
    const advice = index?.advice || '';

    return `
      <div class="p-4 min-w-[300px]">
        <h3 class="font-bold text-lg mb-2">
          ${installation.address.street || ''} ${installation.address.streetNumber || ''}, 
          ${installation.address.city || ''}
        </h3>
        <div class="p-2 rounded mb-2" style="background-color: ${color}20;">
          <div class="font-bold" style="color: ${color}">${quality}</div>
          <div class="text-sm">${advice}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-4">
          <div class="space-y-2">
            <p><span class="font-bold">PM1:</span> ${getValue('PM1')} µg/m³</p>
            <p><span class="font-bold">PM2.5:</span> ${getValue('PM25')} µg/m³</p>
            <p><span class="font-bold">PM10:</span> ${getValue('PM10')} µg/m³</p>
          </div>
          <div class="space-y-2">
            <p><span class="font-bold">Temperatura:</span> ${getValue('TEMPERATURE')}°C</p>
            <p><span class="font-bold">Wilgotność:</span> ${getValue('HUMIDITY')}%</p>
            <p><span class="font-bold">Ciśnienie:</span> ${getValue('PRESSURE')} hPa</p>
          </div>
        </div>
        <div class="text-xs text-gray-500 mt-2">
          Ostatnia aktualizacja: ${new Date(measurements.current.fromDateTime).toLocaleString()}
        </div>
      </div>
    `;
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Initialize map
        const map = L.map(mapRef.current).setView([54.34854, 18.64966], 11);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.control.zoom({
          position: 'bottomright'
        }).addTo(map);

        mapInstance.current = map;

        // Fetch installations
        const installations = await fetchInstallations(54.34854, 18.64966);

        // Add markers for each installation
        for (const installation of installations) {
          try {
            const measurements = await fetchMeasurements(installation.id);
            const marker = L.marker([
              installation.location.latitude,
              installation.location.longitude
            ]);

            const popupContent = createMarkerPopup(installation, measurements);
            marker.bindPopup(popupContent);
            
            // Add color to marker based on air quality index
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
          } catch (error) {
            console.error(`Error processing installation ${installation.id}:`, error);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Wystąpił błąd podczas ładowania danych');
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center min-h-[200px]">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-[#1A1F2C]">
      <CardHeader>
        <CardTitle>Mapa czujników Airly - Trójmiasto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[600px] rounded-lg overflow-hidden" ref={mapRef} />
        <div className="mt-4 text-sm text-muted-foreground">
          Dane pochodzą z czujników Airly. Kliknij w znacznik na mapie, aby zobaczyć szczegółowe informacje o jakości powietrza.
          Kolor znacznika odpowiada jakości powietrza w danym miejscu.
        </div>
      </CardContent>
    </Card>
  );
}
