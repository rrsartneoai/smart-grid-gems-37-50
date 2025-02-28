
import { Installation, Measurement } from './types';

const API_KEY = 'zORU0m4cOxlElF9X4YcvhaR3sfiiqgFP';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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
