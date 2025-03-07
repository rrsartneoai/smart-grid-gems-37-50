
import { SensorResponse } from "@/types/chat";
import { processSensorQuery, isSensorRelatedQuery } from "@/hooks/useSensorQueries";
import { getAirQualityData } from "@/hooks/useAirQualityData";
import { generateRAGResponse } from "@/utils/ragUtils";

export const useQueryProcessor = () => {
  const processQuery = async (input: string): Promise<SensorResponse> => {
    // First, check if it's a sensor-related query
    if (isSensorRelatedQuery(input)) {
      try {
        const sensorResponse = await processSensorQuery(input);
        return sensorResponse;
      } catch (error) {
        console.error("Error processing sensor query:", error);
      }
    }
    
    // Then check if we have local air quality data
    const localData = getAirQualityData(input);
    if (localData.text !== "Nie znalazłem tej informacji w dostępnych danych.") {
      return localData;
    }
    
    // Finally, fall back to RAG response
    const response = await generateRAGResponse(input);
    return { text: response };
  };

  return { processQuery };
};
