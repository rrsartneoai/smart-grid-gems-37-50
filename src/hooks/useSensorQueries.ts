
import { getSensorReadingsByLocation } from "@/components/pomerania/airlyService";
import { fetchAqicnData } from "@/services/airQuality/aqicnService";
import { sensorsData } from "@/components/sensors/SensorsData";
import { SensorResponse, SensorData } from "@/types/chat";

export const isSensorRelatedQuery = (query: string): boolean => {
  const lowercaseQuery = query.toLowerCase();
  const keywords = [
    "jakość powietrza", "powietrze", "czujnik", "czujniki", "sensor", "sensory",
    "pm2.5", "pm10", "pm2,5", "zanieczyszczenie", "smog", "pm1", "pyły",
    "temperatura", "wilgotność", "aqi", "caqi", "stacja", "stacje pomiarowe", 
    "airly", "aqicn", "dane", "odczyt", "ul", "ulica", "ulicy"
  ];
  
  const locations = [
    "gdańsk", "gdansk", "sopot", "gdynia", "trójmiasto", "trojmiasto", 
    "wrzeszcz", "starowiejska", "starowiejskiej"
  ];
  
  for (const keyword of keywords) {
    if (lowercaseQuery.includes(keyword)) {
      return true;
    }
  }
  
  for (const location of locations) {
    if (lowercaseQuery.includes(location) && 
        (lowercaseQuery.includes("powietrze") || 
         lowercaseQuery.includes("jakość") || 
         lowercaseQuery.includes("czujnik") ||
         lowercaseQuery.includes("dane") ||
         lowercaseQuery.includes("odczyt"))) {
      return true;
    }
  }
  
  return false;
};

export const extractLocation = (query: string): string | null => {
  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery.includes("starowiejska") || 
      lowercaseQuery.includes("starowiejskiej")) {
    return "gdynia ul starowiejska";
  }
  
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

export const getSensorData = async (location: string): Promise<{ data: SensorData, source: string } | { error: string }> => {
  try {
    const airlyData = await getSensorReadingsByLocation(location);
    if (!airlyData.error) {
      return {
        data: airlyData,
        source: "Airly"
      };
    }
    
    let stationId = "2684";
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
    
    const gdanskData = sensorsData.gdansk;
    if (gdanskData) {
      const pm25Sensor = gdanskData.sensors.find(s => s.name === "PM 2.5");
      const pm10Sensor = gdanskData.sensors.find(s => s.name === "PM10");
      
      let calculatedAqi = 0;
      if (pm25Sensor && pm10Sensor) {
        calculatedAqi = Math.round((parseFloat(pm25Sensor.value) * 2 + parseFloat(pm10Sensor.value)) / 3);
      }
      
      return {
        data: {
          location: location,
          provider: "SensorsData",
          timestamp: new Date().toISOString(),
          readings: gdanskData.sensors.reduce((acc: Record<string, any>, sensor) => {
            acc[sensor.name] = { value: sensor.value, unit: sensor.unit };
            return acc;
          }, {}),
          airQualityIndex: calculatedAqi
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

export const processSensorQuery = async (query: string): Promise<SensorResponse> => {
  const location = extractLocation(query) || "gdańsk";
  
  const sensorData = await getSensorData(location);
  
  if ('error' in sensorData) {
    return { text: sensorData.error };
  }
  
  const data = sensorData.data;
  const source = sensorData.source;
  
  const lowercaseQuery = query.toLowerCase();
  
  const date = new Date(data.timestamp);
  const formattedDate = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
  if (lowercaseQuery.includes("pm2.5") || lowercaseQuery.includes("pm2,5")) {
    const pm25 = data.readings?.["PM2.5"] || data.readings?.["PM 2.5"];
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
  
  if (lowercaseQuery.includes("pm10")) {
    const pm10 = data.readings?.["PM10"] || data.readings?.["PM 10"];
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
  
  let responseText = `Jakość powietrza w ${data.location} (dane z ${source}, aktualizacja: ${formattedDate}):\n`;
  
  if (data.airQualityIndex) {
    responseText += `\nIndeks jakości powietrza: ${data.airQualityIndex}`;
    if (data.airQualityLevel) {
      responseText += ` (${data.airQualityLevel})`;
    }
  }
  
  const pm25 = data.readings?.["PM2.5"] || data.readings?.["PM 2.5"];
  const pm10 = data.readings?.["PM10"] || data.readings?.["PM 10"];
  
  if (pm25) {
    responseText += `\nPM2.5: ${pm25.value} ${pm25.unit}`;
  }
  
  if (pm10) {
    responseText += `\nPM10: ${pm10.value} ${pm10.unit}`;
  }
  
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
