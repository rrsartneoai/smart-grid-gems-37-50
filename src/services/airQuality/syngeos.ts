
import { AirQualityData, AirQualitySource } from "@/types/company";
import { isInTriCity } from "@/utils/locationUtils";

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
        provider: 'Syngeos',
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

    return {
      source: await fetchSyngeosStations().then(stations => 
        stations.find(s => s.id === stationId)!
      ),
      current: {
        fromDateTime: new Date().toISOString(),
        tillDateTime: new Date().toISOString(),
        values: [
          { name: 'PM2.5', value: data.pm25 },
          { name: 'PM10', value: data.pm10 }
        ],
        indexes: [],
        standards: [],
        pm25: data.pm25,
        pm10: data.pm10,
        temperature: data.temperature,
        humidity: data.humidity,
        pressure: data.pressure
      }
    };
  } catch (error) {
    console.error('Error fetching Syngeos data:', error);
    return null;
  }
};
