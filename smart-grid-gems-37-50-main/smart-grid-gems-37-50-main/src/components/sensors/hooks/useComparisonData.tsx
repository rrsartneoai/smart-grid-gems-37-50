
import { useMemo } from 'react';
import { sensorsData } from "../SensorsData";

interface DataPoint {
  timestamp: string;
  value: number;
}

export const useComparisonData = (city1: string, city2: string, parameter: string) => {
  const cities = useMemo(() => Object.keys(sensorsData), []);
  const parameters = useMemo(() => 
    sensorsData[city1]?.sensors.map(s => s.name) || [], 
    [city1]
  );
  
  // Generate mock historical data - in a real app, this would come from an API
  const generateMockData = (cityName: string): DataPoint[] => {
    return Array.from({ length: 24 }, (_, i) => ({
      timestamp: `${i}:00`,
      value: Math.random() * 50
    }));
  };

  const city1Data = useMemo(() => generateMockData(city1), [city1]);
  const city2Data = useMemo(() => generateMockData(city2), [city2]);

  return {
    cities,
    parameters,
    city1Data,
    city2Data
  };
};
