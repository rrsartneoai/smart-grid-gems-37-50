import { AirQualityData, AirQualityIndex, AirQualitySource } from '@/types';
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
        provider: 'GIOŚ', // Now required
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

    // Find station from the stations list
    const stationsSource = await fetchGIOSStations();
    const source = stationsSource.find(s => s.id === stationId);
    
    if (!source) {
      throw new Error(`Station with ID ${stationId} not found`);
    }

    // Calculate AQI level and color based on PM2.5 values
    const pm25Value = measurements.pm25 || 0;
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
