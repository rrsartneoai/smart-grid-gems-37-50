
export interface AirQualitySource {
  id: string;
  name: string;
  provider: string;
  location: {
    latitude: number;
    longitude: number;
  };
  latitude?: number;  // Kept for backward compatibility
  longitude?: number;  // Kept for backward compatibility
}

export interface AirQualityIndex {
  name?: string;
  value: number;
  level?: string;
  description: string;
  advice: string;
  color: string;
}

export interface AirQualityMeasurements {
  pm25?: number;
  pm10?: number;
  no2?: number;
  o3?: number;
  so2?: number;
  co?: number;
  temperature?: number;
  pressure?: number;
  humidity?: number;
  wind?: number;
  timestamp?: string;
  fromDateTime?: string;
  indexes: AirQualityIndex[];
  standards?: {
    pollutant: string;
    percent: number;
  }[];
  provider?: string;
}

export interface AirQualityHistoricalData {
  parameter: string;
  values: number[];
  timestamps: string[];
  min: number;
  max: number;
}

export interface AirQualityData {
  source: AirQualitySource;
  current: AirQualityMeasurements;
  historicalData?: AirQualityHistoricalData[];
}

// Add this to extension of Leaflet's Marker options to include data property
declare module 'leaflet' {
  interface MarkerOptions {
    data?: any;
  }
}
