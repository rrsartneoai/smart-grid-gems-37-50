
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Installation } from "@/types/company";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface AirlyMapProps {
  installations?: Installation[];
}

export function AirlyMap({ installations = [] }: AirlyMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([54.372158, 18.638306], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Clean up function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Tutaj możesz dodać logikę odświeżania danych
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Card className="w-full h-[500px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Mapa jakości powietrza</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div id="map" className="w-full h-[400px] rounded-md" />
      </CardContent>
    </Card>
  );
}
