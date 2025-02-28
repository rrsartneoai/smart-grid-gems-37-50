
// Typy dla danych Airly
export interface AirlyLocation {
  latitude: number;
  longitude: number;
}

export interface AirlyAddress {
  country?: string;
  city?: string;
  street?: string;
  number?: string;
  displayAddress1?: string;
  displayAddress2?: string;
}

export interface AirlyInstallation {
  id: number;
  location: AirlyLocation;
  address?: AirlyAddress;
  elevation?: number;
  airly: boolean;
  sponsor?: {
    id: number;
    name: string;
    description: string;
    logo: string;
    link: string;
  };
  sponsor?: {
    id: number;
    name: string;
    description: string;
    logo: string;
    link: string;
  };
}

export interface AirlyMeasurement {
  current: {
    fromDateTime: string;
    tillDateTime: string;
    values: Array<{
      name: string;
      value: number;
    }>;
    indexes: Array<{
      name: string;
      value: number;
      level: string;
      description: string;
      advice: string;
      color: string;
    }>;
    standards: Array<{
      name: string;
      pollutant: string;
      limit: number;
      percent: number;
    }>;
  };
}

export interface MapMarker {
  id: number;
  latitude: number;
  longitude: number;
  quality: number;
  color: string;
}
