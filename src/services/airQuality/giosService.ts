
import { AirQualityData, AirQualitySource } from "@/types/company";
import { isInTriCity } from "@/utils/locationUtils";

const GIOS_API_BASE = 'https://api.gios.gov.pl/pjp-api/rest';

export const fetchGIOSStations = async (): Promise<AirQualitySource[]> => {
  try {
    const response = await fetch(`${GIOS_API_BASE}/station/findAll`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const stations = await response.json();
    
    return stations
      .filter((station: any) => {
        const lat = parseFloat(station.gegrLat);
        const lon = parseFloat(station.gegrLon);
        return isInTriCity(lat, lon);
      })
      .map((station: any) => ({
        id: `gios-${station.id}`,
        name: station.stationName,
        provider: 'GIOŚ',
        location: {
          latitude: parseFloat(station.gegrLat),
          longitude: parseFloat(station.gegrLon)
        },
        address: {
          city: station.city.name
        }
      }));
  } catch (error) {
    console.error('Error fetching GIOŚ stations:', error);
    return [];
  }
};

export const fetchGIOSData = async (stationId: string): Promise<AirQualityData | null> => {
  try {
    const rawId = stationId.replace('gios-', '');
    const [sensorData, station] = await Promise.all([
      fetch(`${GIOS_API_BASE}/data/getData/${rawId}`).then(r => r.json()),
      fetch(`${GIOS_API_BASE}/station/sensors/${rawId}`).then(r => r.json())
    ]);

    const measurements: { [key: string]: number } = {};
    station.forEach((sensor: any) => {
      const param = sensor.param.paramCode.toLowerCase();
      const value = sensorData[param]?.values[0]?.value;
      if (value !== undefined) {
        measurements[param] = value;
      }
    });

    return {
      source: await fetchGIOSStations().then(stations => 
        stations.find(s => s.id === stationId)!
      ),
      current: {
        timestamp: new Date().toISOString(),
        pm25: measurements.pm25,
        pm10: measurements.pm10,
        no2: measurements.no2,
        so2: measurements.so2,
        o3: measurements.o3,
        provider: 'GIOŚ'
      }
    };
  } catch (error) {
    console.error('Error fetching GIOŚ data:', error);
    return null;
  }
};
