import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, MapPin, Zap, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChargingStationsMap } from "./ChargingStationsMap";

interface ChargingStation {
  ID: number;
  AddressInfo: {
    Title: string;
    AddressLine1: string;
    Town: string;
    StateOrProvince: string;
    Latitude: number;
    Longitude: number;
  };
  Connections: Array<{
    ConnectionTypeID: number;
    PowerKW: number;
    ConnectionType: {
      Title: string;
    };
  }>;
  OperatorInfo?: {
    Title: string;
  };
}

const API_KEY = 'e44d4c3e-9f3c-4e1d-ad15-5efc0e7f7ac0';

export const ChargingStationsCard = () => {
  const { toast } = useToast();
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);

  const { data: stations, isLoading, error } = useQuery({
    queryKey: ['charging-stations'],
    queryFn: async () => {
      const response = await fetch(
        `https://api.openchargemap.io/v3/poi?key=${API_KEY}&countrycode=PL&maxresults=100`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch charging stations');
      }

      return response.json() as Promise<ChargingStation[]>;
    },
  });

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-500">Error loading charging stations data.</div>
        </CardContent>
      </Card>
    );
  }

  const handleStationClick = (station: ChargingStation) => {
    setSelectedStation(station);
    toast({
      title: "Station Selected",
      description: `${station.AddressInfo.Title} - ${station.AddressInfo.AddressLine1}`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Stacje ładowania w Polsce</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : stations ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stations.map((station) => (
                <TooltipProvider key={station.ID}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card 
                        className="cursor-pointer transition-all hover:shadow-lg"
                        onClick={() => handleStationClick(station)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-5 w-5 text-primary mt-1" />
                              <div>
                                <h3 className="font-semibold">{station.AddressInfo.Title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {station.AddressInfo.AddressLine1}, {station.AddressInfo.Town}
                                </p>
                              </div>
                            </div>
                            {station.OperatorInfo && (
                              <Info className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            {station.Connections.map((conn, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm">
                                  {conn.ConnectionType.Title} - {conn.PowerKW}kW
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click for more details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            
            <ChargingStationsMap stations={stations} />
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};