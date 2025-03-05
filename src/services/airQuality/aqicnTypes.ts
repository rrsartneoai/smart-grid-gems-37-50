
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
  } | string; // API can return "no such station" as a string
}

// Station IDs for Tricity area - updated with working IDs
export const TRICITY_STATION_IDS = [
  'A252829', // Osinskiego, Gdansk - This one is working
  '@2684',   // Station from provided API token
  '@8767',   // Gdynia Pogorze
  '@8770',   // Sopot
  '@8768',   // Gdansk Wrzeszcz
  '@8769',   // Gdansk Nowy Port
  '@8771',   // Gdynia Srodmiescie
  '@8772'    // Gdynia Dabrowa
];
