import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BikeStationsMap } from "./BikeStationsMap";
import { Bike, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const CITIES = [
  { id: "gdansk", name: "Gdańsk" },
  { id: "gdynia", name: "Gdynia" },
  { id: "sopot", name: "Sopot" }
];

export const BikeStationsCard = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("gdansk");
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

        // Filter stations based on selected city
        const filteredStations = combinedStations.filter((station: Station) => {
          const address = station.address.toLowerCase();
          return address.includes(selectedCity);
        });

        setStations(filteredStations);
        console.log(`Fetched MEVO stations for ${selectedCity}:`, filteredStations);
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
  }, [toast, selectedCity]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="h-6 w-6 text-primary" />
            <CardTitle>Stacje MEVO</CardTitle>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>Ładowanie danych...</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Wybierz miasto" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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