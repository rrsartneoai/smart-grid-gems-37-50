
import { AirQualityData, AirQualitySource } from "@/types/company";
import { isInTriCity } from "@/utils/locationUtils";

// Update Syngeos API endpoint to use HTTPS and the correct path
const SYNGEOS_API = 'https://api.syngeos.pl/public/data/air';

export const fetchSyngeosStations = async (): Promise<AirQualitySource[]> => {
  try {
    const response = await fetch(SYNGEOS_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    return data.stations
      .filter((station: any) => isInTriCity(station.latitude, station.longitude))
      .map((station: any) => ({
        id: `syngeos-${station.id}`,
        name: station.name || 'Stacja Syngeos',
        provider: 'Syngeos', // Now required
        location: {
          latitude: station.latitude,
          longitude: station.longitude
        }
      }));
  } catch (error) {
    console.error('Error fetching Syngeos stations:', error);
    return [];
  }
};

export const fetchSyngeosData = async (stationId: string): Promise<AirQualityData | null> => {
  try {
    const rawId = stationId.replace('syngeos-', '');
    const response = await fetch(`${SYNGEOS_API}/station/${rawId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Find station from the stations list
    const stationsSource = await fetchSyngeosStations();
    const source = stationsSource.find(s => s.id === stationId);
    
    if (!source) {
      throw new Error(`Station with ID ${stationId} not found`);
    }

    // Calculate an air quality index based on PM2.5 values
    const pm25Value = data.pm25 || 0;
    let level = "good";
    let color = "#9ACD32"; // Default good color
    let description = "Dobra";
    let advice = "Jakość powietrza jest zadowalająca";

    if (pm25Value > 25) {
      level = "moderate";
      color = "#FFFF00";
      description = "Umiarkowana";
      advice = "Jakość powietrza jest akceptowalna";
    } else if (pm25Value > 50) {
      level = "unhealthy";
      color = "#FF9900";
      description = "Niezdrowa";
      advice = "Ogranicz aktywność na zewnątrz";
    }

    return {
      source: source,
      current: {
        indexes: [{ 
          value: pm25Value,
          level: level,
          description: description,
          advice: advice,
          color: color
        }],
        timestamp: new Date().toISOString(),
        pm25: data.pm25,
        pm10: data.pm10,
        temperature: data.temperature,
        humidity: data.humidity,
        pressure: data.pressure,
        provider: 'Syngeos'
      }
    };
  } catch (error) {
    console.error('Error fetching Syngeos data:', error);
    return null;
  }
};
