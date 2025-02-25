import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchInstallations, fetchMeasurements } from "./airlyService";
import { createMarkerPopup } from "./AirQualityPopup";
import { fetchGIOSStations, fetchGIOSData } from "@/services/airQuality/giosService";
import { fetchSyngeosStations, fetchSyngeosData } from "@/services/airQuality/syngeos";
import { AirQualityData } from "@/types/company";
import { isInTriCity } from "@/utils/locationUtils";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createMarker = (data: AirQualityData, map: L.Map) => {
  const { source, current } = data;
  const marker = L.marker([source.location.latitude, source.location.longitude]);
  
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
  const [stats, setStats] = useState({ total: 0, loaded: 0 });

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      setIsLoading(true);
      setError(null);
      setStats({ total: 0, loaded: 0 });

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

        const [airlyStations, giosStations, syngeosStations] = await Promise.all([
          fetchInstallations(54.372158, 18.638306).catch(err => {
            console.error('Error fetching Airly stations:', err);
            return [];
          }),
          fetchGIOSStations().catch(err => {
            console.error('Error fetching GIOŚ stations:', err);
            return [];
          }),
          fetchSyngeosStations().catch(err => {
            console.error('Error fetching Syngeos stations:', err);
            return [];
          })
        ]);

        console.log(`Found stations: Airly: ${airlyStations.length}, GIOŚ: ${giosStations.length}, Syngeos: ${syngeosStations.length}`);

        const totalStations = airlyStations.length + giosStations.length + syngeosStations.length;
        setStats(prev => ({ ...prev, total: totalStations }));

        const processStations = async (stations: any[], fetchData: (id: string) => Promise<any>, provider: string) => {
          const batchSize = 5;
          for (let i = 0; i < stations.length; i += batchSize) {
            const batch = stations.slice(i, i + batchSize);
            await Promise.all(batch.map(async (station) => {
              try {
                const data = await fetchData(station.id);
                if (data) {
                  const marker = createMarker(data, map);
                  markersRef.current.push(marker);
                  setStats(prev => ({ ...prev, loaded: prev.loaded + 1 }));
                }
              } catch (error) {
                console.error(`Error processing ${provider} station ${station.id}:`, error);
              }
            }));
            await delay(500);
          }
        };

        await Promise.all([
          processStations(airlyStations, async (id) => {
            const measurements = await fetchMeasurements(Number(id.replace('airly-', '')));
            return {
              source: {
                id,
                name: `Airly ${measurements.location?.address?.street || ''}`,
                provider: 'Airly',
                location: measurements.location,
                address: measurements.location?.address
              },
              current: {
                ...measurements.current,
                provider: 'Airly',
                timestamp: measurements.current.fromDateTime
              }
            };
          }, 'Airly'),
          processStations(giosStations, fetchGIOSData, 'GIOŚ'),
          processStations(syngeosStations, fetchSyngeosData, 'Syngeos')
        ]);

        console.log('All stations processed');
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
    <Card className="dark:bg-[#1A1F2C] font-['Montserrat']">
      <CardHeader>
        <CardTitle className="text-xl">Mapa czujników jakości powietrza - Trójmiasto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[600px] rounded-lg overflow-hidden relative" ref={mapRef}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <div className="text-sm text-gray-500">
                  Ładowanie czujników... ({stats.loaded}/{stats.total})
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-500 text-center p-4 bg-background/95 rounded-lg">
                <div className="font-bold mb-2">Błąd</div>
                <div>{error}</div>
              </div>
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
