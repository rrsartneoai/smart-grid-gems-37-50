import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Sun, Cloud, CloudRain, Wind, Droplet, RefreshCw, ThermometerSun } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

const cities = [
  { id: "gdansk", name: "Gdańsk", lat: 54.352, lon: 18.6466 },
  { id: "gdynia", name: "Gdynia", lat: 54.5189, lon: 18.5305 },
  { id: "sopot", name: "Sopot", lat: 54.4418, lon: 18.5601 },
  { id: "slupsk", name: "Słupsk", lat: 54.4641, lon: 17.0285 },
];

export const WeatherPanel = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const { toast } = useToast();

  const { data: weatherData, isLoading, error, refetch } = useQuery({
    queryKey: ['weather', selectedCity.id],
    queryFn: async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=96b7e811c904f7bf183cf3a334ed6977&units=metric&lang=pl`
      );
      if (!response.ok) {
        throw new Error('Błąd pobierania danych pogodowych');
      }
      return response.json() as Promise<WeatherData>;
    },
    refetchInterval: 300000, // Odświeżaj co 5 minut
  });

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <Sun className="h-12 w-12 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="h-12 w-12 text-gray-500" />;
      case 'rain':
        return <CloudRain className="h-12 w-12 text-blue-500" />;
      default:
        return <ThermometerSun className="h-12 w-12 text-orange-500" />;
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Odświeżanie",
      description: "Dane pogodowe zostały zaktualizowane",
    });
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-red-500">Błąd pobierania danych pogodowych</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Pogoda w województwie pomorskim</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select
            value={selectedCity.id}
            onValueChange={(value) => setSelectedCity(cities.find(city => city.id === value) || cities[0])}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Wybierz miasto" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : weatherData ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center p-4 bg-card rounded-lg border">
              {getWeatherIcon(weatherData.weather[0].main)}
              <div className="mt-2 text-2xl font-bold">
                {Math.round(weatherData.main.temp)}°C
              </div>
              <div className="text-muted-foreground">
                {weatherData.weather[0].description}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-blue-500" />
                <span>Prędkość wiatru: {Math.round(weatherData.wind.speed * 3.6)} km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500" />
                <span>Wilgotność: {weatherData.main.humidity}%</span>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};