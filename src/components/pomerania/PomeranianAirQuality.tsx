
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

interface AirQualityData {
  current: {
    values: Array<{
      name: string;
      value: number;
    }>;
    indexes: Array<{
      value: number;
      level: string;
      description: string;
    }>;
  };
}

const AIRLY_API_KEY = "zORU0m4cOxlElF9X4YcvhaR3sfiiqgFP";
const GDANSK_LAT = 54.352;
const GDANSK_LON = 18.646;

export function PomeranianAirQuality() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['airlyData'],
    queryFn: async () => {
      const response = await fetch(
        `https://airapi.airly.eu/v2/measurements/point?lat=${GDANSK_LAT}&lng=${GDANSK_LON}`,
        {
          headers: {
            'Accept': 'application/json',
            'apikey': AIRLY_API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<AirQualityData>;
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

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
          Błąd podczas ładowania danych o jakości powietrza
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jakość powietrza w województwie pomorskim</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.current.values.map((measurement) => (
            <Card key={measurement.name}>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {measurement.value.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {measurement.name}
                </div>
              </CardContent>
            </Card>
          ))}
          {data?.current.indexes.map((index) => (
            <Card key={index.description}>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{index.value}</div>
                <div className="text-sm text-muted-foreground">
                  {index.description}
                </div>
                <div className="mt-2 text-sm">
                  Poziom: {index.level}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
