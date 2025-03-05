
import { AQICNResponse } from './aqicnTypes';
import { AirQualityData } from '@/types/airQuality.types';

/**
 * Convert AQICN data to our application format
 */
export const convertAQICNDataToAppFormat = (data: AQICNResponse): AirQualityData | null => {
  // Check if the response status is not ok or data is a string (error message)
  if (data.status !== "ok" || typeof data.data === 'string') {
    console.warn(`Invalid data for station: ${typeof data.data === 'string' ? data.data : 'unknown error'}`);
    return null;
  }
  
  const { city, iaqi, time, aqi, dominentpol } = data.data;
  
  // Extract values from iaqi safely
  const pm25 = iaqi.pm25?.v;
  const pm10 = iaqi.pm10?.v;
  const no2 = iaqi.no2?.v;
  const so2 = iaqi.so2?.v;
  const o3 = iaqi.o3?.v;
  const co = iaqi.co?.v;
  const temperature = iaqi.t?.v;
  const humidity = iaqi.h?.v;
  const pressure = iaqi.p?.v;
  
  // Generate color based on AQI
  const getColorByAQI = (aqi: number) => {
    if (aqi <= 50) return '#00E400'; // Good
    if (aqi <= 100) return '#FFFF00'; // Moderate
    if (aqi <= 150) return '#FF7E00'; // Unhealthy for sensitive groups
    if (aqi <= 200) return '#FF0000'; // Unhealthy
    if (aqi <= 300) return '#8F3F97'; // Very unhealthy
    return '#7E0023'; // Hazardous
  };
  
  // Get level and description based on AQI
  const getLevelAndDescription = (aqi: number) => {
    if (aqi <= 50) return { level: 'good', description: 'Bardzo dobra', advice: 'Jakość powietrza jest zadowalająca' };
    if (aqi <= 100) return { level: 'moderate', description: 'Dobra', advice: 'Jakość powietrza jest akceptowalna' };
    if (aqi <= 150) return { level: 'unhealthy-for-sensitive', description: 'Umiarkowana', advice: 'Osoby wrażliwe powinny ograniczyć przebywanie na zewnątrz' };
    if (aqi <= 200) return { level: 'unhealthy', description: 'Zła', advice: 'Ogranicz przebywanie na zewnątrz' };
    if (aqi <= 300) return { level: 'very-unhealthy', description: 'Bardzo zła', advice: 'Unikaj przebywania na zewnątrz' };
    return { level: 'hazardous', description: 'Niebezpieczna', advice: 'Pozostań w pomieszczeniach zamkniętych' };
  };
  
  const { level, description, advice } = getLevelAndDescription(aqi);
  const color = getColorByAQI(aqi);
  
  // Convert to our application format
  return {
    source: {
      id: `aqicn-${data.data.idx}`,
      name: city.name,
      provider: 'AQICN',
      location: {
        latitude: city.geo[0],
        longitude: city.geo[1]
      }
    },
    current: {
      indexes: [{
        name: 'AQI',
        value: aqi,
        level,
        description,
        advice,
        color
      }],
      pm25,
      pm10,
      no2,
      o3,
      so2,
      co,
      temperature,
      humidity,
      pressure,
      provider: 'AQICN',
      timestamp: time.iso
    },
    historicalData: []
  };
};
