
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { sensorsData } from "@/components/sensors/SensorsData";

export const useSensorData = (initialCity: string = "gdansk") => {
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  
  const cities = Object.keys(sensorsData).map(key => 
    key.charAt(0).toUpperCase() + key.slice(1)
  );

  const { data: weatherData } = useQuery({
    queryKey: ['weather', selectedCity],
    queryFn: async () => {
      const city = sensorsData[selectedCity];
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.coordinates.lat}&lon=${city.coordinates.lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric&lang=pl`
      );
      if (!response.ok) {
        throw new Error(t("weatherDataError"));
      }
      return response.json();
    },
    refetchInterval: 300000,
  });

  const { data: airQualityData } = useQuery({
    queryKey: ['airQuality', selectedCity],
    queryFn: async () => {
      const city = sensorsData[selectedCity];
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${city.coordinates.lat}&lon=${city.coordinates.lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(t("airQualityError"));
      }
      return response.json();
    },
    refetchInterval: 300000,
  });

  const currentCityData = sensorsData[selectedCity];

  const handleCitySelect = (city: string) => {
    setSelectedCity(city.toLowerCase());
  };

  const getSensorData = (sensorName: string) => {
    if (!weatherData || !airQualityData) return null;

    switch (sensorName) {
      case "Temp":
        return {
          value: weatherData.main.temp.toFixed(1),
          description: `Temperatura odczuwalna: ${weatherData.main.feels_like.toFixed(1)}°C`,
        };
      case "Humidity":
        return {
          value: weatherData.main.humidity,
          description: "Wilgotność względna powietrza",
        };
      case "PM 2.5":
        return {
          value: airQualityData.list[0].components.pm2_5.toFixed(1),
          description: "Pył zawieszony PM2.5",
        };
      case "PM10":
        return {
          value: airQualityData.list[0].components.pm10.toFixed(1),
          description: "Pył zawieszony PM10",
        };
      case "NO₂":
        return {
          value: airQualityData.list[0].components.no2.toFixed(1),
          description: "Dwutlenek azotu",
        };
      case "SO₂":
        return {
          value: airQualityData.list[0].components.so2.toFixed(1),
          description: "Dwutlenek siarki",
        };
      case "CO":
        return {
          value: airQualityData.list[0].components.co.toFixed(0),
          description: "Tlenek węgla",
        };
      case "O₃":
        return {
          value: airQualityData.list[0].components.o3.toFixed(1),
          description: "Ozon",
        };
      default:
        return null;
    }
  };

  const getFilteredSensors = () => {
    if (!currentCityData) return [];
    
    return currentCityData.sensors.map(sensor => {
      const realData = getSensorData(sensor.name);
      if (realData) {
        return {
          ...sensor,
          value: realData.value,
          description: realData.description,
        };
      }
      return sensor;
    }).filter(sensor =>
      sensor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensor.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return {
    selectedCity,
    searchQuery,
    setSearchQuery,
    cities,
    currentCityData,
    handleCitySelect,
    getFilteredSensors,
    weatherData,
    airQualityData
  };
};
