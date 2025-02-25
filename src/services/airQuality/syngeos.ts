
import { AirQualityData, AirQualitySource } from "@/types/company";

const SYNGEOS_API = 'https://api.syngeos.pl/api/public/measurements';

export const fetchSyngeosStations = async (): Promise<AirQualitySource[]> => {
  try {
    const response = await fetch(SYNGEOS_API);
    const data = await response.json();
    
    return data.sensors
      .filter((sensor: any) => isInTriCity(sensor.lat, sensor.lng))
      .map((sensor: any) => ({
        id: `syngeos-${sensor.id}`,
        name: sensor.name,
        provider: 'Syngeos',
        location: {
          latitude: sensor.lat,
          longitude: sensor.lng
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
    const response = await fetch(`${SYNGEOS_API}/${rawId}`);
    const data = await response.json();

    return {
      source: await fetchSyngeosStations().then(stations => 
        stations.find(s => s.id === stationId)!
      ),
      current: {
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
