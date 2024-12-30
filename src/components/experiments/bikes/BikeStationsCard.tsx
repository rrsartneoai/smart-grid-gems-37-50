import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CitySelector } from "./CitySelector";
import { BikeStationsMap } from "./BikeStationsMap";

const cities = ["Gdańsk", "Gdynia", "Sopot"];

export const BikeStationsCard = () => {
  const [selectedCity, setSelectedCity] = useState<string>("gdansk");

  const { data: stations, isLoading } = useQuery({
    queryKey: ['bike-stations', selectedCity],
    queryFn: async () => {
      console.log('Fetching bike stations for city:', selectedCity);
      
      // First, get the station information
      const infoResponse = await fetch(
        'https://gbfs.urbansharing.com/rowermevo.pl/station_information.json',
        {
          headers: {
            'Client-Identifier': 'lovable-web-app'
          }
        }
      );

      const statusResponse = await fetch(
        'https://gbfs.urbansharing.com/rowermevo.pl/station_status.json',
        {
          headers: {
            'Client-Identifier': 'lovable-web-app'
          }
        }
      );

      if (!infoResponse.ok || !statusResponse.ok) {
        throw new Error('Failed to fetch bike stations');
      }

      const infoData = await infoResponse.json();
      const statusData = await statusResponse.json();

      // Combine station information with status
      const stations = infoData.data.stations.map((station: any) => {
        const status = statusData.data.stations.find(
          (s: any) => s.station_id === station.station_id
        );
        return {
          ...station,
          ...status
        };
      });

      // Filter stations by city if needed
      return stations.filter((station: any) => 
        station.name.toLowerCase().includes(selectedCity.toLowerCase())
      );
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Stacje rowerowe MEVO</CardTitle>
      </CardHeader>
      <CardContent>
        <CitySelector
          cities={cities}
          selectedCity={selectedCity}
          onCitySelect={setSelectedCity}
        />

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : stations ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stations.map((station: any) => (
                <Card key={station.station_id} className="p-4">
                  <h3 className="font-semibold">{station.name}</h3>
                  <p className="text-sm text-muted-foreground">{station.address}</p>
                  <div className="mt-2 space-y-1">
                    <p>Dostępne rowery: {station.num_bikes_available}</p>
                    <p>Wolne miejsca: {station.num_docks_available}</p>
                    <p>Pojemność: {station.capacity}</p>
                  </div>
                </Card>
              ))}
            </div>
            
            <BikeStationsMap stations={stations} />
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};