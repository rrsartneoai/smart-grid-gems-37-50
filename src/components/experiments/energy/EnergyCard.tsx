import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { EUROPEAN_COUNTRIES } from "./constants";
import { ProductionChart } from "./ProductionChart";
import { ForecastChart } from "./ForecastChart";
import { fetchPowerData, fetchPowerForecast, fetchConsumptionForecast } from "@/utils/electricityApi";

export function EnergyCard() {
  const [selectedCountry, setSelectedCountry] = useState(EUROPEAN_COUNTRIES[0]);
  const { toast } = useToast();

  const handleApiKeySet = () => {
    const apiKey = prompt("Please enter your Electricity Maps API key:");
    if (apiKey) {
      localStorage.setItem('ELECTRICITY_MAPS_API_KEY', apiKey);
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved. Refreshing data...",
      });
      refetchAll();
    }
  };

  const { 
    data: powerData, 
    isLoading: isPowerLoading, 
    error: powerError,
    refetch: refetchPower 
  } = useQuery({
    queryKey: ['power-data', selectedCountry.id],
    queryFn: () => fetchPowerData(selectedCountry.lat, selectedCountry.lon),
    refetchInterval: 300000,
  });

  const {
    data: productionForecast,
    isLoading: isProductionLoading,
    error: productionError,
    refetch: refetchProduction
  } = useQuery({
    queryKey: ['production-forecast', selectedCountry.id],
    queryFn: () => fetchPowerForecast(selectedCountry.id),
    refetchInterval: 300000,
  });

  const {
    data: consumptionForecast,
    isLoading: isConsumptionLoading,
    error: consumptionError,
    refetch: refetchConsumption
  } = useQuery({
    queryKey: ['consumption-forecast', selectedCountry.id],
    queryFn: () => fetchConsumptionForecast(selectedCountry.lat, selectedCountry.lon),
    refetchInterval: 300000,
  });

  const refetchAll = () => {
    refetchPower();
    refetchProduction();
    refetchConsumption();
  };

  if (!localStorage.getItem('ELECTRICITY_MAPS_API_KEY')) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p>Please set your Electricity Maps API key to view energy data.</p>
            <Button onClick={handleApiKeySet}>Set API Key</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isLoading = isPowerLoading || isProductionLoading || isConsumptionLoading;
  const error = powerError || productionError || consumptionError;

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-red-500">Error loading energy data. Please check your API key.</div>
          <Button onClick={handleApiKeySet} className="mt-4">Update API Key</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Select
            value={selectedCountry.id}
            onValueChange={(value) => {
              const country = EUROPEAN_COUNTRIES.find(c => c.id === value);
              if (country) setSelectedCountry(country);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {EUROPEAN_COUNTRIES.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {powerData && (
            <div className="text-sm font-normal">
              <span className="text-green-500">{powerData.fossilFreePercentage}% Fossil-Free</span>
              {" | "}
              <span className="text-emerald-500">{powerData.renewablePercentage}% Renewable</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {powerData && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Current Production</h3>
                <ProductionChart data={powerData.powerProductionBreakdown} />
              </div>
            )}
            {productionForecast && consumptionForecast && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Production vs Consumption Forecast</h3>
                <ForecastChart 
                  productionForecast={productionForecast}
                  consumptionForecast={consumptionForecast}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}