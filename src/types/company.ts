export interface Coordinates {
  lon: number;
  lat: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Rain {
  "1h"?: number;
  "3h"?: number;
}

export interface Snow {
  "1h"?: number;
  "3h"?: number;
}

export interface SystemInfo {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface CurrentWeather {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: Wind;
  clouds: { all: number };
  rain?: Rain;
  snow?: Snow;
  dt: number;
  sys: SystemInfo;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: { all: number };
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: { "3h": number };
  snow?: { "3h": number };
  sys: { pod: string };
  dt_txt: string;
}

export interface WeatherForecast {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface AirQualityData {
  source: {
    id: string;
    name: string;
    provider: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  current: {
    indexes: {
      name?: string;
      value: number;
      level?: string;
      description: string;
      advice: string;
      color: string;
    }[];
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
    standards?: {
      pollutant: string;
      percent: number;
    }[];
    provider?: string;
  };
  historicalData?: {
    parameter: string;
    values: number[];
    timestamps: string[];
    min: number;
    max: number;
  }[];
}

export interface WeatherSettings {
  units: "metric" | "imperial";
  displayOptions: {
    details: boolean;
    forecast: boolean;
    airQuality: boolean;
    map: boolean;
  };
}

// Updated CompanyStats interface to match how it's being used
export interface CompanyStat {
  title: string;
  value: string | number;
  unit?: string;
  icon: any;
  description: string;
  details: { label: string; value: string }[];
}

// Updating Company interface
export interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  contact?: {
    email: string;
    phone: string;
    address: string;
  };
  stats: CompanyStat[];
  energyData: any[]; // This can be more specific if needed
}

// Keeping the original CompanyStats for backward compatibility
export interface CompanyStats {
  employees: number;
  customers: number;
  projects: number;
  energySaved: number;
}

// Updated CompanyData interface
export interface CompanyData {
  companies: Company[];
}

// Updated CompanyStoreState to include selectedCompanyId
export interface CompanyStoreState {
  selectedCompany: Company | null;
  selectedCompanyId: string;
  setSelectedCompany: (company: Company) => void;
  setSelectedCompanyId: (id: string) => void;
}

export interface AirQualitySource {
  id: string;
  name: string;
  provider: string;  // Changed from optional to required
  location: {
    latitude: number;
    longitude: number;
  };
  latitude?: number;  // These are kept for backward compatibility
  longitude?: number;
}

// Add this to extension of Leaflet's Marker options to include data property
declare module 'leaflet' {
  interface MarkerOptions {
    data?: any;
  }
}
