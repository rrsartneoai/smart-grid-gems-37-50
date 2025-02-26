
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { generateRAGResponse } from "@/utils/ragUtils";
import { sensorsData } from "@/components/sensors/SensorsData";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  dataVisualizations?: Array<{
    type: "airQuality" | "temperature" | "humidity";
    title: string;
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

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Witaj! Jestem twoim asystentem. Mogę pomóc w przetwarzaniu dokumentów i odpowiadaniu na pytania o jakość powietrza. Jak mogę ci pomóc?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const clearConversation = () => {
    setMessages([
      {
        role: "assistant",
        content: "Witaj! Jestem twoim asystentem. Mogę pomóc w przetwarzaniu dokumentów i odpowiadaniu na pytania o jakość powietrza. Jak mogę ci pomóc?",
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
      // First, check local sensor data
      const localData = getAirQualityData(input);
      if (localData.text !== "Nie znalazłem tej informacji w dostępnych danych.") {
        return localData;
      }
      
      // If no local data found, try RAG with uploaded documents
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
