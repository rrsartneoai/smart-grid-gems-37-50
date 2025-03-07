
import { AirQualityData } from "@/types/company";

const AQICN_TOKEN = '5a1271b20fbbb9c972814a7b8d31512e061e83e6';
const API_BASE_URL = 'https://api.waqi.info/feed';

// List of station IDs in Tricity area
export const AQICN_STATIONS = [
  {id: '2684', name: 'Gdańsk Wrzeszcz'},
  {id: '@251428', name: 'Gdańsk Śródmieście'},
  {id: '@77089', name: 'Gdańsk Nowy Port'},
  {id: '@237496', name: 'Gdańsk Stogi'},
  {id: '@63286', name: 'Sopot'},
  {id: '@103345', name: 'Gdańsk Szadółki'},
  {id: '@232498', name: 'Gdynia Pogórze'},
  {id: '@62983', name: 'Gdynia'},
  {id: '@203761', name: 'Gdynia Dąbrowa'},
  {id: '@77029', name: 'Gdynia Śródmieście'},
  {id: '@93433', name: 'Gdańsk Jasień'},
  {id: '@192865', name: 'Gdańsk Oliwa'},
  {id: '@197041', name: 'Gdańsk Przymorze'},
  {id: '@101890', name: 'Gdańsk Zaspa'},
  {id: '@370810', name: 'Gdańsk Brzeźno'},
  {id: '@104527', name: 'Gdańsk Suchanino'},
  {id: '@251821', name: 'Gdańsk Chełm'},
  {id: '@467518', name: 'Gdańsk Morena'},
  {id: '@509191', name: 'Gdańsk Osowa'},
  {id: '@64192', name: 'Gdańsk Piecki-Migowo'},
  {id: '@176593', name: 'Gdańsk Ujeścisko'},
  {id: '@84283', name: 'Gdynia Witomino'},
  {id: '@192910', name: 'Gdynia Orłowo'},
  {id: '@375472', name: 'Gdynia Oksywie'},
];

// Cache for AQICN data to avoid excessive API calls
const dataCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

export const fetchAqicnData = async (stationId: string): Promise<any> => {
  const now = Date.now();
  const cachedData = dataCache.get(stationId);
  
  if (cachedData && (now - cachedData.timestamp) < CACHE_EXPIRY) {
    console.log(`Using cached data for station ${stationId}`);
    return cachedData.data;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/${stationId}/?token=${AQICN_TOKEN}`);
    if (!response.ok) {
      throw new Error(`AQICN API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'ok') {
      dataCache.set(stationId, { data: data.data, timestamp: now });
      return data.data;
    } else {
      console.error('AQICN API returned error:', data);
      throw new Error(`AQICN API error: ${data.status}`);
    }
  } catch (error) {
    console.error(`Error fetching AQICN data for station ${stationId}:`, error);
    throw error;
  }
};

export const transformAqicnToAirQualityData = (stationId: string, data: any, stationName?: string): AirQualityData => {
  // Extract values or use defaults for missing data
  const pm25 = data.iaqi?.pm25?.v;
  const pm10 = data.iaqi?.pm10?.v;
  const no2 = data.iaqi?.no2?.v;
  const so2 = data.iaqi?.so2?.v;
  const o3 = data.iaqi?.o3?.v;
  const co = data.iaqi?.co?.v;
  const temperature = data.iaqi?.t?.v;
  const humidity = data.iaqi?.h?.v;
  const pressure = data.iaqi?.p?.v;
  const windSpeed = data.iaqi?.w?.v;  // Wind speed
  
  // Get AQI index and determine color and level
  const aqi = data.aqi;
  let color = '#999999';
  let level = 'Unknown';
  let description = 'Brak danych';
  let advice = '';
  
  if (aqi !== undefined) {
    if (aqi <= 50) {
      color = '#34D399';
      level = 'Good';
      description = 'Bardzo dobra';
      advice = 'Jakość powietrza jest zadowalająca, można bezpiecznie przebywać na zewnątrz.';
    } else if (aqi <= 100) {
      color = '#FBBF24';
      level = 'Moderate';
      description = 'Dobra';
      advice = 'Jakość powietrza jest akceptowalna, jednak osoby wrażliwe mogą odczuwać lekki dyskomfort.';
    } else if (aqi <= 150) {
      color = '#F59E0B';
      level = 'Unhealthy for Sensitive Groups';
      description = 'Umiarkowana';
      advice = 'Osoby wrażliwe (dzieci, osoby starsze, osoby z chorobami układu oddechowego) powinny ograniczyć przebywanie na zewnątrz.';
    } else if (aqi <= 200) {
      color = '#EF4444';
      level = 'Unhealthy';
      description = 'Zła';
      advice = 'Wszyscy powinni ograniczyć przebywanie na zewnątrz, szczególnie osoby wrażliwe.';
    } else if (aqi <= 300) {
      color = '#991B1B';
      level = 'Very Unhealthy';
      description = 'Bardzo zła';
      advice = 'Należy unikać przebywania na zewnątrz. Jeśli to możliwe, zostań w domu i zamknij okna.';
    } else {
      color = '#7F1D1D';
      level = 'Hazardous';
      description = 'Niebezpieczna';
      advice = 'Stan alarmowy! Unikaj wszelkiej aktywności na zewnątrz i zabezpiecz swój dom przed zanieczyszczonym powietrzem.';
    }
  }
  
  // Get station name from data if not provided
  const name = stationName || data.city?.name || `Station ${stationId}`;
  
  // Create AirQualityData object
  return {
    source: {
      id: `aqicn-${stationId}`,
      name: name,
      provider: 'AQICN',
      location: {
        latitude: data.city?.geo?.[0] || 0,
        longitude: data.city?.geo?.[1] || 0,
        address: {
          displayAddress1: name,
          displayAddress2: 'Pomorskie, Polska'
        }
      }
    },
    current: {
      timestamp: data.time?.iso || new Date().toISOString(),
      fromDateTime: data.time?.iso || new Date().toISOString(),
      tillDateTime: data.time?.iso || new Date().toISOString(),
      indexes: [
        {
          name: 'AQI',
          value: aqi,
          level: level,
          description: description,
          advice: advice,
          color: color
        }
      ],
      values: [
        { name: 'PM2.5', value: pm25 || 0 },
        { name: 'PM10', value: pm10 || 0 },
        { name: 'NO2', value: no2 || 0 },
        { name: 'SO2', value: so2 || 0 },
        { name: 'O3', value: o3 || 0 },
        { name: 'CO', value: co || 0 },
      ],
      pm25: pm25,
      pm10: pm10,
      no2: no2,
      so2: so2,
      o3: o3,
      co: co,
      temperature: temperature,
      humidity: humidity,
      pressure: pressure,
      windSpeed: windSpeed,
      provider: 'AQICN'
    }
  };
};

export const fetchAllAqicnStations = async (): Promise<AirQualityData[]> => {
  try {
    const stationPromises = AQICN_STATIONS.map(async (station) => {
      try {
        const data = await fetchAqicnData(station.id);
        return transformAqicnToAirQualityData(station.id, data, station.name);
      } catch (error) {
        console.error(`Error processing station ${station.id}:`, error);
        return null;
      }
    });
    
    const stationsData = await Promise.all(stationPromises);
    return stationsData.filter(Boolean) as AirQualityData[];
  } catch (error) {
    console.error('Error fetching data from AQICN stations:', error);
    return [];
  }
};
