
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function AirlyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([54.34854, 18.64966], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Dodaj kontrolki zoom w prawym dolnym rogu
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    mapInstance.current = map;

    // Dodaj znacznik dla lokalizacji Gdańska
    const marker = L.marker([54.34854, 18.64966])
      .addTo(map)
      .bindPopup(`
        <div class="p-4">
          <h3 class="font-bold text-lg">Gdańsk</h3>
          <div class="mt-2">
            <p>PM10: 7 µg/m³ (16%)</p>
            <p>PM2.5: 6 µg/m³ (40%)</p>
            <p>PM1: 4 µg/m³</p>
          </div>
          <div class="mt-2">
            <p>Temperatura: -5°C</p>
            <p>Wilgotność: 81%</p>
            <p>Ciśnienie: 1022 hPa</p>
            <p>Wiatr: 16 km/h</p>
          </div>
        </div>
      `);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <Card className="dark:bg-[#1A1F2C]">
      <CardHeader>
        <CardTitle>Mapa jakości powietrza Airly - Gdańsk</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[600px] rounded-lg overflow-hidden" ref={mapRef} />
        <div className="mt-4 text-sm text-muted-foreground">
          Dane pochodzą z czujników Airly. Możesz zobaczyć szczegółowe informacje klikając na znacznik na mapie.
        </div>
      </CardContent>
    </Card>
  );
}
