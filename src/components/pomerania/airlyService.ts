
import { Installation, Measurement } from './types';

const API_KEY = 'zORU0m4cOxlElF9X4YcvhaR3sfiiqgFP';

export const fetchInstallations = async (lat: number, lng: number): Promise<Installation[]> => {
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
      throw new Error('Nie udało się pobrać danych o czujnikach');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching installations:', error);
    throw error;
  }
};

export const fetchMeasurements = async (installationId: number): Promise<Measurement> => {
  try {
    const response = await fetch(
      `https://airapi.airly.eu/v2/measurements/installation?installationId=${installationId}`,
      {
        headers: {
          'Accept': 'application/json',
          'apikey': API_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Nie udało się pobrać pomiarów');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching measurements:', error);
    throw error;
  }
};
