
// AQICN API Service
const API_TOKEN = '5a1271b20fbbb9c972814a7b8d31512e061e83e6';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedData<T> {
  data: T;
  timestamp: number;
}

// AQICN API Response type
export interface AQICNResponse {
  status: string;
  data: {
    aqi: number;
    idx: number;
    attributions: Array<{
      url: string;
      name: string;
      station?: string;
    }>;
    city: {
      geo: [number, number]; // [latitude, longitude]
      name: string;
      url: string;
      location: string;
    };
    dominentpol: string;
    iaqi: {
      [key: string]: {
        v: number;
      };
    };
    time: {
      s: string;
      tz: string;
      v: number;
      iso: string;
    };
  };
}

// Cache functions
const getFromCache = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp }: CachedData<T> = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

const setCache = <T>(key: string, data: T): void => {
  try {
    const cacheData: CachedData<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

// Station IDs for Tricity area
export const TRICITY_STATION_IDS = [
  'A252829', // Osinskiego, Gdansk
  'A321342', // Gdynia Pogorze
  'A161225', // Sopot
  'A325653', // Gdansk Wrzeszcz
  'A209683', // Gdansk Nowy Port
  'A334219', // Gdynia Srodmiescie
  'A174177'  // Gdynia Dabrowa
];

// Function to fetch data for a single station
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

// Convert AQICN data to our application format
export const convertAQICNDataToAppFormat = (data: AQICNResponse) => {
  const { city, iaqi, time, aqi, dominentpol } = data.data;
  
  // Extract values from iaqi
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

// Fetch data for all stations
export const fetchAllAQICNStations = async () => {
  const stationDataPromises = TRICITY_STATION_IDS.map(id => 
    fetchAQICNStationData(id)
      .then(data => convertAQICNDataToAppFormat(data))
      .catch(error => {
        console.error(`Error fetching data for station ${id}:`, error);
        return null;
      })
  );
  
  const stationsData = await Promise.all(stationDataPromises);
  return stationsData.filter(data => data !== null);
};
