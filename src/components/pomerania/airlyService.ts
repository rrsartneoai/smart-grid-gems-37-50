
import { Installation, Measurement } from './types';

const API_KEY = 'zORU0m4cOxlElF9X4YcvhaR3sfiiqgFP';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const LONG_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for rate limited responses

interface CachedData<T> {
  data: T;
  timestamp: number;
}

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

const setCache = <T>(key: string, data: T, duration = CACHE_DURATION): void => {
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

export const fetchInstallations = async (lat: number, lng: number): Promise<Installation[]> => {
  const cacheKey = `installations-${lat}-${lng}`;
  const cached = getFromCache<Installation[]>(cacheKey);
  
  if (cached) {
    console.log('Using cached installations data');
    return cached;
  }

  try {
    const response = await fetch(
      `https://airapi.airly.eu/v2/installations/nearest?lat=${lat}&lng=${lng}&maxDistanceKM=10&maxResults=100`,
      {
        headers: {
          'Accept': 'application/json',
          'apikey': API_KEY
        }
      }
    );
    
    if (response.status === 429) {
      console.warn('Airly API rate limit reached');
      // Try to get even expired cache data
      const expired = localStorage.getItem(cacheKey);
      if (expired) {
        try {
          const { data } = JSON.parse(expired);
          // Save the expired data with a longer expiration
          setCache(cacheKey, data, LONG_CACHE_DURATION);
          return data;
        } catch (e) {
          console.error('Error parsing expired cache:', e);
        }
      }
      throw new Error(`Failed to fetch installations: ${response.status}`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch installations: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching installations:', error);
    throw error;
  }
};

export const fetchMeasurements = async (installationId: number): Promise<Measurement> => {
  const cacheKey = `measurements-${installationId}`;
  const cached = getFromCache<Measurement>(cacheKey);
  
  if (cached) {
    console.log(`Using cached measurements data for installation ${installationId}`);
    return cached;
  }

  try {
    const response = await fetch(
      `https://airapi.airly.eu/v2/measurements/installation?installationId=${installationId}&includeWind=true&includeForecast=true`,
      {
        headers: {
          'Accept': 'application/json',
          'apikey': API_KEY
        }
      }
    );
    
    if (response.status === 429) {
      console.warn('Airly API rate limit reached for measurements');
      // Try to get even expired cache data
      const expired = localStorage.getItem(cacheKey);
      if (expired) {
        try {
          const { data } = JSON.parse(expired);
          // Save the expired data with a longer expiration
          setCache(cacheKey, data, LONG_CACHE_DURATION);
          return data;
        } catch (e) {
          console.error('Error parsing expired cache:', e);
        }
      }
      throw new Error(`Failed to fetch measurements: ${response.status}`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch measurements: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching measurements:', error);
    throw error;
  }
};

// Helper function to clear all cached data
export const clearAirlyCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('installations-') || key.startsWith('measurements-')) {
        localStorage.removeItem(key);
      }
    });
    console.log('Airly cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

// New function to get clean sensor data for the chatbot
export const getSensorReadingsByLocation = async (location: string): Promise<any> => {
  try {
    // Convert location name to coordinates (simplified)
    const coordinates = getCoordinatesForLocation(location);
    if (!coordinates) {
      return { error: "Nie znaleziono lokalizacji" };
    }
    
    // Get installations for this location
    const installations = await fetchInstallations(coordinates.lat, coordinates.lng);
    if (!installations || installations.length === 0) {
      return { error: "Brak czujników w tej lokalizacji" };
    }
    
    // Get measurements for the closest installation
    const closestInstallation = installations[0];
    const measurements = await fetchMeasurements(closestInstallation.id);
    
    // Format the data for display
    const readingsData = {
      location: closestInstallation.address?.displayAddress1 || location,
      provider: "Airly",
      timestamp: measurements.current?.fromDateTime || new Date().toISOString(),
      airQualityIndex: measurements.current?.indexes?.[0]?.value || null,
      airQualityLevel: measurements.current?.indexes?.[0]?.level || null,
      airQualityDescription: measurements.current?.indexes?.[0]?.description || null,
      readings: measurements.current?.values?.reduce((acc: Record<string, any>, val) => {
        acc[val.name] = { value: val.value, unit: getUnitForReading(val.name) };
        return acc;
      }, {}) || {},
      temperature: measurements.current?.temperature,
      humidity: measurements.current?.humidity,
      pressure: measurements.current?.pressure,
      installationId: closestInstallation.id
    };
    
    return readingsData;
  } catch (error) {
    console.error("Error getting sensor readings:", error);
    return { error: "Nie udało się pobrać danych z czujników" };
  }
};

// Helper function to map sensor names to units
const getUnitForReading = (name: string): string => {
  const units: Record<string, string> = {
    "PM1": "μg/m³",
    "PM2.5": "μg/m³",
    "PM10": "μg/m³",
    "TEMPERATURE": "°C",
    "HUMIDITY": "%",
    "PRESSURE": "hPa",
    "NO2": "μg/m³",
    "O3": "μg/m³",
    "SO2": "μg/m³",
    "CO": "μg/m³"
  };
  
  return units[name] || "";
};

// Simplified function to get coordinates for common locations
const getCoordinatesForLocation = (location: string): { lat: number, lng: number } | null => {
  const locationMap: Record<string, { lat: number, lng: number }> = {
    "gdańsk": { lat: 54.372158, lng: 18.638306 },
    "gdansk": { lat: 54.372158, lng: 18.638306 },
    "gdańsk wrzeszcz": { lat: 54.3813, lng: 18.5954 },
    "gdansk wrzeszcz": { lat: 54.3813, lng: 18.5954 },
    "sopot": { lat: 54.441581, lng: 18.560096 },
    "gdynia": { lat: 54.5189, lng: 18.5305 },
    "trójmiasto": { lat: 54.441581, lng: 18.560096 }, // Center point
    "trojmiasto": { lat: 54.441581, lng: 18.560096 }
  };
  
  // Convert to lowercase and remove diacritics for comparison
  const normalizedLocation = location.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  
  // Try exact match first
  if (locationMap[normalizedLocation]) {
    return locationMap[normalizedLocation];
  }
  
  // Try partial match
  for (const [key, coords] of Object.entries(locationMap)) {
    if (normalizedLocation.includes(key) || key.includes(normalizedLocation)) {
      return coords;
    }
  }
  
  return null;
};
