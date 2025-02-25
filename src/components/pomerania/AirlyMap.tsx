
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchInstallations, fetchMeasurements } from "./airlyService";
import { createMarkerPopup } from "./AirQualityPopup";
import { fetchGIOSStations, fetchGIOSData } from "@/services/airQuality/giosService";
import { fetchSyngeosStations, fetchSyngeosData } from "@/services/airQuality/syngeos";
import { AirQualityData, AirQualitySource } from "@/types/company";

// Utility function to check if coordinates are in the Tri-City area
export const isInTriCity = (lat: number, lon: number) => {
  const bounds = {
    north: 54.60,  // North of Gdynia
    south: 54.30,  // South of Gdańsk
    east: 18.70,   // East coast
    west: 18.40    // West of Gdynia
  };
  return lat >= bounds.south && lat <= bounds.north && lon >= bounds.west && lon <= bounds.east;
};

// Rate limiting helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createMarker = (data: AirQualityData, map: L.Map) => {
  const { source, current } = data;
  const marker = L.marker([source.location.latitude, source.location.longitude]);
  
  // Calculate color based on PM2.5 or PM10 values
  let color = '#gray';
  let value = 0;
  if (current.pm25 !== undefined) {
    value = current.pm25;
    color = value <= 10 ? '#34D399' : 
            value <= 25 ? '#FBBF24' : 
            value <= 50 ? '#F59E0B' : '#EF4444';
  } else if (current.pm10 !== undefined) {
    value = current.pm10;
    color = value <= 20 ? '#34D399' : 
            value <= 50 ? '#FBBF24' : 
            value <= 100 ? '#F59E0B' : '#EF4444';
  }

  marker.setIcon(L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${color};
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
    ">${Math.round(value)}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  }));

  const popupContent = createMarkerPopup(data);
  marker.bindPopup(popupContent, {
    maxWidth: 400,
    className: 'airly-popup'
  });

  marker.addTo(map);
  return marker;
};

export function AirlyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

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

        // Fetch data from all providers
        const [airlyStations, giosStations, syngeosStations] = await Promise.all([
          fetchInstallations(54.372158, 18.638306),
          fetchGIOSStations(),
          fetchSyngeosStations()
        ]);

        // Process Airly stations
        for (const station of airlyStations) {
          try {
            const measurements = await fetchMeasurements(station.id);
            const data: AirQualityData = {
              source: {
                id: `airly-${station.id}`,
                name: `Airly ${station.address.street || ''}`,
                provider: 'Airly',
                location: {
                  latitude: station.location.latitude,
                  longitude: station.location.longitude
                },
                address: station.address
              },
              current: {
                ...measurements.current,
                provider: 'Airly',
                timestamp: measurements.current.fromDateTime
              }
            };
            const marker = createMarker(data, map);
            markersRef.current.push(marker);
            await delay(100);
          } catch (error) {
            console.error(`Error processing Airly station ${station.id}:`, error);
          }
        }

        // Process GIOŚ stations
        for (const station of giosStations) {
          try {
            const data = await fetchGIOSData(station.id);
            if (data) {
              const marker = createMarker(data, map);
              markersRef.current.push(marker);
              await delay(100);
            }
          } catch (error) {
            console.error(`Error processing GIOŚ station ${station.id}:`, error);
          }
        }

        // Process Syngeos stations
        for (const station of syngeosStations) {
          try {
            const data = await fetchSyngeosData(station.id);
            if (data) {
              const marker = createMarker(data, map);
              markersRef.current.push(marker);
              await delay(100);
            }
          } catch (error) {
            console.error(`Error processing Syngeos station ${station.id}:`, error);
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
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <Card className="dark:bg-[#1A1F2C] font-['Montserrat']">
      <CardHeader>
        <CardTitle className="text-xl">Mapa czujników jakości powietrza - Trójmiasto</CardTitle>
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
          Dane pochodzą z różnych źródeł: Airly, GIOŚ, Syngeos. Kliknij w znacznik na mapie, aby zobaczyć szczegółowe informacje o jakości powietrza.
          Kolor znacznika odpowiada jakości powietrza w danym miejscu.
        </div>
      </CardContent>
    </Card>
  );
}
