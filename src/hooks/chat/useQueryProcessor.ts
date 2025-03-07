import { SensorResponse } from "@/types/chat";
import { processSensorQuery, isSensorRelatedQuery } from "@/hooks/useSensorQueries";
import { getAirQualityData } from "@/hooks/useAirQualityData";
import { generateRAGResponse } from "@/utils/ragUtils";
import { fetchAqicnData } from "@/services/airQuality/aqicnService";
import { AQICN_STATIONS } from "@/services/airQuality/aqicnStations";

// Check if the query is related to map data
const isMapDataQuery = (query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  return (
    (lowerQuery.includes("mapa") || lowerQuery.includes("map")) && 
    (lowerQuery.includes("czujnik") || lowerQuery.includes("sensor") || 
     lowerQuery.includes("stacja") || lowerQuery.includes("station") ||
     lowerQuery.includes("jakość powietrza") || lowerQuery.includes("air quality"))
  );
};

// Function to process map data queries
const processMapDataQuery = async (query: string): Promise<SensorResponse> => {
  const lowerQuery = query.toLowerCase();
  
  // Updated station IDs based on the error message from the API
  // Using @ prefix for user-contributed stations as per AQICN API requirements
  let stationId = "@62983"; // Default to Gdynia as it's more likely to have data
  let stationName = "Gdynia";

  if (lowerQuery.includes("wrzeszcz") || lowerQuery.includes("gdańsk wrzeszcz")) {
    stationId = "@237496"; // Try this instead of 2684 which is returning Unknown station
    stationName = "Gdańsk Wrzeszcz";
  } else if (lowerQuery.includes("gdynia")) {
    stationId = "@62983";
    stationName = "Gdynia";
  } else if (lowerQuery.includes("sopot")) {
    stationId = "@63286";
    stationName = "Sopot";
  } else if (lowerQuery.includes("zaspa")) {
    stationId = "@101890";
    stationName = "Gdańsk Zaspa";
  } else if (lowerQuery.includes("morena")) {
    stationId = "@467518";
    stationName = "Gdańsk Morena";
  } else if (lowerQuery.includes("oliwa")) {
    stationId = "@192865";
    stationName = "Gdańsk Oliwa";
  }
  
  try {
    // Fetch the data from AQICN API
    const data = await fetchAqicnData(stationId);
    
    if (!data) {
      return { 
        text: `Nie udało się pobrać danych z wybranej stacji pomiarowej ${stationName}. Spróbuj zapytać o inną stację lub spróbuj ponownie za chwilę.`
      };
    }
    
    // Prepare the air quality data
    const aqi = data.aqi || "brak danych";
    const pm25 = data.iaqi?.pm25?.v || "brak danych";
    const pm10 = data.iaqi?.pm10?.v || "brak danych";
    const temperature = data.iaqi?.t?.v || "brak danych";
    const humidity = data.iaqi?.h?.v || "brak danych";
    const pressure = data.iaqi?.p?.v || "brak danych";

    // Create a visualization for the data
    const sensorData = {
      location: stationName,
      provider: "AQICN",
      timestamp: data.time?.iso || new Date().toISOString(),
      airQualityIndex: data.aqi,
      readings: {
        "PM2.5": { value: pm25, unit: "μg/m³" },
        "PM10": { value: pm10, unit: "μg/m³" },
      },
      temperature: temperature,
      humidity: humidity,
      pressure: pressure
    };

    // Create response text
    let qualityDescription = "nieznana";
    if (aqi <= 50) qualityDescription = "dobra";
    else if (aqi <= 100) qualityDescription = "umiarkowana";
    else if (aqi <= 150) qualityDescription = "niezdrowa dla osób wrażliwych";
    else if (aqi <= 200) qualityDescription = "niezdrowa";
    else if (aqi <= 300) qualityDescription = "bardzo niezdrowa";
    else if (aqi > 300) qualityDescription = "niebezpieczna";

    const responseText = `Dane ze stacji pomiarowej ${stationName}:\n\nIndeks jakości powietrza (AQI): ${aqi} (${qualityDescription})\nPM2.5: ${pm25} μg/m³\nPM10: ${pm10} μg/m³\nTemperatura: ${temperature} °C\nWilgotność: ${humidity}%\nCiśnienie: ${pressure} hPa`;

    return {
      text: responseText,
      visualizations: [
        {
          type: "sensorReading",
          title: `Stacja pomiarowa: ${stationName}`,
          data: sensorData
        }
      ]
    };
  } catch (error) {
    console.error("Error fetching map sensor data:", error);
    return {
      text: `Wystąpił błąd podczas pobierania danych ze stacji ${stationName}. Spróbuj zapytać o inną stację lub spróbuj ponownie później.`
    };
  }
};

// Return a list of available stations
const getAvailableStations = (): SensorResponse => {
  const stationList = AQICN_STATIONS.slice(0, 10).map(station => station.name).join("\n- ");
  
  return {
    text: `Dostępne stacje pomiarowe:\n- ${stationList}\n\nAby sprawdzić dane z konkretnej stacji, zapytaj o "jakość powietrza w [nazwa stacji]" lub "dane z czujnika w [nazwa stacji]".`
  };
};

export const useQueryProcessor = () => {
  const processQuery = async (input: string): Promise<SensorResponse> => {
    // Handle map data queries
    if (isMapDataQuery(input)) {
      // If asking for list of stations
      if (input.toLowerCase().includes("lista stacji") || 
          input.toLowerCase().includes("dostępne stacje") ||
          input.toLowerCase().includes("jakie stacje") ||
          input.toLowerCase().includes("pokaż stacje")) {
        return getAvailableStations();
      }
      
      try {
        console.log("Processing map data query:", input);
        const mapDataResponse = await processMapDataQuery(input);
        return mapDataResponse;
      } catch (error) {
        console.error("Error processing map data query:", error);
        return {
          text: "Wystąpił błąd podczas przetwarzania zapytania o dane z mapy. Spróbuj zapytać inaczej lub o inną stację."
        };
      }
    }
    
    // First, check if it's a sensor-related query
    if (isSensorRelatedQuery(input)) {
      try {
        const sensorResponse = await processSensorQuery(input);
        return sensorResponse;
      } catch (error) {
        console.error("Error processing sensor query:", error);
        return {
          text: "Wystąpił błąd podczas przetwarzania zapytania o dane z czujników. Spróbuj zapytać inaczej."
        };
      }
    }
    
    // Then check if we have local air quality data
    const localData = getAirQualityData(input);
    if (localData.text !== "Nie znalazłem tej informacji w dostępnych danych.") {
      return localData;
    }
    
    // Finally, fall back to RAG response
    try {
      const response = await generateRAGResponse(input);
      return { text: response };
    } catch (error) {
      console.error("Error generating RAG response:", error);
      return { 
        text: "Przepraszam, wystąpił błąd podczas przetwarzania zapytania. Proszę spróbować ponownie."
      };
    }
  };

  return { processQuery };
};
