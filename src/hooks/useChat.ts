
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { generateRAGResponse } from "@/utils/ragUtils";
import { sensorsData } from "@/components/sensors/SensorsData";
import { getSensorReadingsByLocation } from "@/components/pomerania/airlyService";
import { fetchAqicnData } from "@/services/airQuality/aqicnService";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  dataVisualizations?: Array<{
    type: "airQuality" | "temperature" | "humidity" | "sensorReading";
    title: string;
    data?: any;
  }>;
}

const getAirQualityData = (query: string): { text: string; visualizations?: Message["dataVisualizations"] } => {
  const lowercaseQuery = query.toLowerCase();
  const gdanskData = sensorsData.gdansk;
  
  if (!gdanskData) {
    return { text: "Przepraszam, ale nie mogę znaleźć danych dla Gdańska." };
  }

  // Check for specific air quality parameters
  if (lowercaseQuery.includes("pm2.5") || lowercaseQuery.includes("pm2,5")) {
    const pm25Sensor = gdanskData.sensors.find(s => s.name === "PM 2.5");
    if (pm25Sensor) {
      return {
        text: `Aktualny poziom PM2.5 w Gdańsku wynosi ${pm25Sensor.value} ${pm25Sensor.unit}. ${pm25Sensor.description}`,
        visualizations: [{ type: "airQuality", title: "Poziom PM2.5" }]
      };
    }
  }

  if (lowercaseQuery.includes("pm10")) {
    const pm10Sensor = gdanskData.sensors.find(s => s.name === "PM10");
    if (pm10Sensor) {
      return {
        text: `Aktualny poziom PM10 w Gdańsku wynosi ${pm10Sensor.value} ${pm10Sensor.unit}. ${pm10Sensor.description}`,
        visualizations: [{ type: "airQuality", title: "Poziom PM10" }]
      };
    }
  }

  // General air quality queries
  if (lowercaseQuery.includes("jakość powietrza") || lowercaseQuery.includes("zanieczyszczenie")) {
    const airQualityInfo = gdanskData.sensors
      .filter(s => ["PM 2.5", "PM10"].includes(s.name))
      .map(s => `${s.name}: ${s.value} ${s.unit} (${s.status})`)
      .join("\n");

    return {
      text: `Aktualna jakość powietrza w Gdańsku:\n${airQualityInfo}`,
      visualizations: [{ type: "airQuality", title: "Jakość powietrza" }]
    };
  }

  // Temperature and humidity as secondary parameters
  if (lowercaseQuery.includes("temperatura")) {
    const tempSensor = gdanskData.sensors.find(s => s.name === "Temp");
    if (tempSensor) {
      return {
        text: `Aktualna temperatura w Gdańsku wynosi ${tempSensor.value} ${tempSensor.unit}. ${tempSensor.description}`,
        visualizations: [{ type: "temperature", title: "Temperatura" }]
      };
    }
  }

  if (lowercaseQuery.includes("wilgotność")) {
    const humiditySensor = gdanskData.sensors.find(s => s.name === "Humidity");
    if (humiditySensor) {
      return {
        text: `Aktualna wilgotność w Gdańsku wynosi ${humiditySensor.value} ${humiditySensor.unit}. ${humiditySensor.description}`,
        visualizations: [{ type: "humidity", title: "Wilgotność" }]
      };
    }
  }

  return { text: "Nie znalazłem tej informacji w dostępnych danych." };
};

// Function to check if a query is related to air quality or sensor information
const isSensorRelatedQuery = (query: string): boolean => {
  const lowercaseQuery = query.toLowerCase();
  const keywords = [
    "jakość powietrza", "powietrze", "czujnik", "czujniki", "sensor", "sensory",
    "pm2.5", "pm10", "pm2,5", "zanieczyszczenie", "smog", "pm1", "pyły",
    "temperatura", "wilgotność", "aqi", "caqi", "stacja", "stacje pomiarowe", 
    "airly", "aqicn"
  ];
  
  // Check for location markers paired with quality indicators
  const locations = ["gdańsk", "gdansk", "sopot", "gdynia", "trójmiasto", "trojmiasto", "wrzeszcz"];
  
  // Check for keywords
  for (const keyword of keywords) {
    if (lowercaseQuery.includes(keyword)) {
      return true;
    }
  }
  
  // Check for location + indicator patterns
  for (const location of locations) {
    if (lowercaseQuery.includes(location) && 
        (lowercaseQuery.includes("powietrze") || 
         lowercaseQuery.includes("jakość") || 
         lowercaseQuery.includes("czujnik"))) {
      return true;
    }
  }
  
  return false;
};

// Function to extract location from query
const extractLocation = (query: string): string | null => {
  const lowercaseQuery = query.toLowerCase();
  const locations = [
    { name: "gdańsk wrzeszcz", keywords: ["gdańsk wrzeszcz", "gdansk wrzeszcz", "wrzeszcz"] },
    { name: "gdańsk", keywords: ["gdańsk", "gdansk"] },
    { name: "sopot", keywords: ["sopot"] },
    { name: "gdynia", keywords: ["gdynia"] },
    { name: "trójmiasto", keywords: ["trójmiasto", "trojmiasto", "trójmieście", "trojmiescie"] }
  ];
  
  for (const location of locations) {
    for (const keyword of location.keywords) {
      if (lowercaseQuery.includes(keyword)) {
        return location.name;
      }
    }
  }
  
  return null;
};

// Function to get sensor data from multiple sources
const getSensorData = async (location: string): Promise<any> => {
  try {
    // First try Airly
    const airlyData = await getSensorReadingsByLocation(location);
    if (!airlyData.error) {
      return {
        data: airlyData,
        source: "Airly"
      };
    }
    
    // If Airly fails, try AQICN
    // Use a simplified version for AQICN stationId based on location
    let stationId = "2684"; // Default to Gdańsk Wrzeszcz
    if (location.toLowerCase().includes("sopot")) {
      stationId = "@63286";
    } else if (location.toLowerCase().includes("gdynia")) {
      stationId = "@62983";
    }
    
    try {
      const aqicnData = await fetchAqicnData(stationId);
      if (aqicnData) {
        return {
          data: {
            location: location,
            provider: "AQICN",
            timestamp: new Date().toISOString(),
            airQualityIndex: aqicnData.aqi,
            readings: {
              "PM2.5": { value: aqicnData.iaqi?.pm25?.v || 0, unit: "μg/m³" },
              "PM10": { value: aqicnData.iaqi?.pm10?.v || 0, unit: "μg/m³" },
              "NO2": { value: aqicnData.iaqi?.no2?.v || 0, unit: "μg/m³" },
              "O3": { value: aqicnData.iaqi?.o3?.v || 0, unit: "μg/m³" },
              "SO2": { value: aqicnData.iaqi?.so2?.v || 0, unit: "μg/m³" },
              "CO": { value: aqicnData.iaqi?.co?.v || 0, unit: "μg/m³" }
            },
            temperature: aqicnData.iaqi?.t?.v,
            humidity: aqicnData.iaqi?.h?.v,
            pressure: aqicnData.iaqi?.p?.v
          },
          source: "AQICN"
        };
      }
    } catch (error) {
      console.error("AQICN fetch error:", error);
    }
    
    // If all fails, fallback to static data
    const gdanskData = sensorsData.gdansk;
    if (gdanskData) {
      return {
        data: {
          location: location,
          provider: "SensorsData",
          timestamp: new Date().toISOString(),
          readings: gdanskData.sensors.reduce((acc: Record<string, any>, sensor) => {
            acc[sensor.name] = { value: sensor.value, unit: sensor.unit };
            return acc;
          }, {}),
          airQualityIndex: gdanskData.aqi
        },
        source: "SensorsData"
      };
    }
    
    return { error: "Nie udało się pobrać danych z czujników" };
  } catch (error) {
    console.error("Error getting sensor data:", error);
    return { error: "Wystąpił błąd podczas pobierania danych" };
  }
};

// Function to generate response for sensor data queries
const processSensorQuery = async (query: string): Promise<{ text: string; visualizations?: Message["dataVisualizations"] }> => {
  // Extract location from query or default to Gdańsk
  const location = extractLocation(query) || "gdańsk";
  
  // Get sensor data
  const sensorData = await getSensorData(location);
  
  if (sensorData.error) {
    return { text: sensorData.error };
  }
  
  const data = sensorData.data;
  const source = sensorData.source;
  
  // Format response based on query type
  const lowercaseQuery = query.toLowerCase();
  
  // Format date
  const date = new Date(data.timestamp);
  const formattedDate = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
  // PM2.5 specific query
  if (lowercaseQuery.includes("pm2.5") || lowercaseQuery.includes("pm2,5")) {
    const pm25 = data.readings["PM2.5"] || data.readings["PM 2.5"];
    if (pm25) {
      return {
        text: `Aktualny poziom PM2.5 w ${data.location} wynosi ${pm25.value} ${pm25.unit}. Dane z ${source}, aktualizacja: ${formattedDate}.`,
        visualizations: [{ 
          type: "sensorReading", 
          title: `PM2.5 - ${data.location}`,
          data: {
            readings: { "PM2.5": pm25 },
            provider: source,
            location: data.location,
            timestamp: data.timestamp
          }
        }]
      };
    }
  }
  
  // PM10 specific query
  if (lowercaseQuery.includes("pm10")) {
    const pm10 = data.readings["PM10"] || data.readings["PM 10"];
    if (pm10) {
      return {
        text: `Aktualny poziom PM10 w ${data.location} wynosi ${pm10.value} ${pm10.unit}. Dane z ${source}, aktualizacja: ${formattedDate}.`,
        visualizations: [{ 
          type: "sensorReading", 
          title: `PM10 - ${data.location}`,
          data: {
            readings: { "PM10": pm10 },
            provider: source,
            location: data.location,
            timestamp: data.timestamp
          }
        }]
      };
    }
  }
  
  // Temperature query
  if (lowercaseQuery.includes("temperatura")) {
    if (data.temperature) {
      return {
        text: `Aktualna temperatura w ${data.location} wynosi ${data.temperature}°C. Dane z ${source}, aktualizacja: ${formattedDate}.`,
        visualizations: [{ 
          type: "temperature", 
          title: `Temperatura - ${data.location}`,
          data: {
            temperature: data.temperature,
            provider: source,
            location: data.location,
            timestamp: data.timestamp
          }
        }]
      };
    }
  }
  
  // Humidity query
  if (lowercaseQuery.includes("wilgotność")) {
    if (data.humidity) {
      return {
        text: `Aktualna wilgotność w ${data.location} wynosi ${data.humidity}%. Dane z ${source}, aktualizacja: ${formattedDate}.`,
        visualizations: [{ 
          type: "humidity", 
          title: `Wilgotność - ${data.location}`,
          data: {
            humidity: data.humidity,
            provider: source,
            location: data.location,
            timestamp: data.timestamp
          }
        }]
      };
    }
  }
  
  // General air quality query - return all data
  let responseText = `Jakość powietrza w ${data.location} (dane z ${source}, aktualizacja: ${formattedDate}):\n`;
  
  if (data.airQualityIndex) {
    responseText += `\nIndeks jakości powietrza: ${data.airQualityIndex}`;
    if (data.airQualityLevel) {
      responseText += ` (${data.airQualityLevel})`;
    }
  }
  
  // Add PM readings
  const pm25 = data.readings["PM2.5"] || data.readings["PM 2.5"];
  const pm10 = data.readings["PM10"] || data.readings["PM 10"];
  
  if (pm25) {
    responseText += `\nPM2.5: ${pm25.value} ${pm25.unit}`;
  }
  
  if (pm10) {
    responseText += `\nPM10: ${pm10.value} ${pm10.unit}`;
  }
  
  // Add other readings if available
  if (data.temperature) {
    responseText += `\nTemperatura: ${data.temperature}°C`;
  }
  
  if (data.humidity) {
    responseText += `\nWilgotność: ${data.humidity}%`;
  }
  
  if (data.pressure) {
    responseText += `\nCiśnienie: ${data.pressure} hPa`;
  }
  
  return {
    text: responseText,
    visualizations: [{ 
      type: "sensorReading", 
      title: `Jakość powietrza - ${data.location}`,
      data: data
    }]
  };
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Witaj! Jestem twoim asystentem monitorowania stanu jakości powietrza. Jak mogę ci pomóc?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const clearConversation = () => {
    setMessages([
      {
        role: "assistant",
        content: "Witaj! Jestem twoim asystentem monitorowania stanu jakości powietrza. Jak mogę ci pomóc?",
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "Konwersacja wyczyszczona",
      description: "Historia czatu została zresetowana.",
    });
  };

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (input: string) => {
      // Check if the query is related to sensors or air quality
      if (isSensorRelatedQuery(input)) {
        try {
          // Process sensor-specific query
          const sensorResponse = await processSensorQuery(input);
          return sensorResponse;
        } catch (error) {
          console.error("Error processing sensor query:", error);
          // Fall through to other methods if sensor-specific processing fails
        }
      }
      
      // Check local sensor data as fallback
      const localData = getAirQualityData(input);
      if (localData.text !== "Nie znalazłem tej informacji w dostępnych danych.") {
        return localData;
      }
      
      // If no sensor data found, try RAG with uploaded documents
      const response = await generateRAGResponse(input);
      return { text: response };
    },
    onSuccess: (response) => {
      const newMessage = {
        role: "assistant" as const,
        content: response.text,
        timestamp: new Date(),
        dataVisualizations: response.visualizations,
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się uzyskać odpowiedzi. Spróbuj ponownie.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    sendMessage(input);
    setInput("");
  };

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isPending,
    clearConversation
  };
};
