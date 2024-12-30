import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BikeStationsMap } from "./BikeStationsMap";
import { Bike, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Station {
  station_id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  capacity: number;
  num_bikes_available: number;
  num_docks_available: number;
  last_reported: number;
}

export const BikeStationsCard = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStations = async () => {
      try {
        // Fetch station information
        const infoResponse = await fetch('https://gbfs.urbansharing.com/rowermevo.pl/station_information.json');
        const statusResponse = await fetch('https://gbfs.urbansharing.com/rowermevo.pl/station_status.json');
        
        const infoData = await infoResponse.json();
        const statusData = await statusResponse.json();

        // Combine station information with status
        const combinedStations = infoData.data.stations.map((station: any) => {
          const status = statusData.data.stations.find(
            (s: any) => s.station_id === station.station_id
          );
          return {
            ...station,
            ...status,
          };
        });

        setStations(combinedStations);
        console.log("Fetched MEVO stations:", combinedStations);
      } catch (error) {
        console.error("Error fetching MEVO stations:", error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać danych o stacjach MEVO",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
    const interval = setInterval(fetchStations, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="h-6 w-6 text-primary" />
            <CardTitle>Stacje MEVO w Gdańsku</CardTitle>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>Ładowanie danych...</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <BikeStationsMap stations={stations} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.map((station) => (
              <Card key={station.station_id} className="p-4">
                <h3 className="font-semibold mb-2">{station.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{station.address}</p>
                <div className="flex justify-between text-sm">
                  <span>Dostępne rowery: {station.num_bikes_available}</span>
                  <span>Wolne miejsca: {station.num_docks_available}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};