
import { AQICNResponse, TRICITY_STATION_IDS } from './aqicnTypes';
import { getFromCache, setCache } from './aqicnCache';
import { convertAQICNDataToAppFormat } from './aqicnTransform';
import { AirQualityData } from '@/types/company';

// AQICN API Token
const API_TOKEN = '5a1271b20fbbb9c972814a7b8d31512e061e83e6';

/**
 * Fetch data for a single station from AQICN API
 */
export const fetchAQICNStationData = async (stationId: string): Promise<AQICNResponse> => {
  const cacheKey = `aqicn-station-${stationId}`;
  const cached = getFromCache<AQICNResponse>(cacheKey);
  
  if (cached) {
    console.log(`Using cached AQICN data for station ${stationId}`);
    return cached;
  }

  try {
    const response = await fetch(
      `https://api.waqi.info/feed/${stationId}/?token=${API_TOKEN}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch AQICN data: ${response.status} ${response.statusText}`);
    }
    
    const data: AQICNResponse = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching AQICN data for station ${stationId}:`, error);
    throw error;
  }
};

/**
 * Fetch air quality data for all stations
 */
export const fetchAllAQICNStations = async (): Promise<AirQualityData[]> => {
  const stationDataPromises = TRICITY_STATION_IDS.map(id => 
    fetchAQICNStationData(id)
      .then(data => convertAQICNDataToAppFormat(data))
      .catch(error => {
        console.error(`Error fetching data for station ${id}:`, error);
        return null;
      })
  );
  
  const stationsData = await Promise.all(stationDataPromises);
  return stationsData.filter(data => data !== null) as AirQualityData[];
};
