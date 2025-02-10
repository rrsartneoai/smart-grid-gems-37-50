import { SensorIcon, SensorIconType } from "./SensorIcon";

export interface SensorData {
  iconType: SensorIconType;
  name: string;
  value: string;
  unit: string;
  status: "Good" | "Warning";
  description: string;
}

export interface CityData {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  sensors: SensorData[];
}

const sensorDescriptions = {
  temp: "Temperatura powietrza - kluczowy parametr wpływający na komfort cieplny. Optymalna temperatura w pomieszczeniach to 20-22°C.",
  co2: "Stężenie dwutlenku węgla - wskaźnik jakości powietrza. Poziomy powyżej 1000 ppm mogą powodować zmęczenie i trudności w koncentracji.",
  voc: "Lotne związki organiczne - substancje chemiczne mogące negatywnie wpływać na zdrowie. Niskie poziomy są kluczowe dla dobrej jakości powietrza.",
  pm25: "Pył zawieszony PM2.5 - drobne cząstki mogące przenikać do płuc. Poziomy poniżej 25 µg/m³ są uznawane za bezpieczne.",
  pm10: "Pył zawieszony PM10 - większe cząstki pyłu. Poziomy poniżej 50 µg/m³ są uznawane za bezpieczne dla zdrowia.",
  humidity: "Wilgotność powietrza - wpływa na komfort i zdrowie. Optymalne poziomy mieszczą się w zakresie 40-60%.",
  noise: "Poziom hałasu - wpływa na komfort i koncentrację. Poziomy powyżej 65 dBA mogą być uciążliwe.",
  pressure: "Ciśnienie atmosferyczne - wpływa na samopoczucie. Nagłe zmiany mogą powodować dolegliwości u osób wrażliwych.",
  light: "Natężenie światła - wpływa na komfort wizualny i produktywność. Optymalne poziomy zależą od rodzaju wykonywanej pracy.",
};

export const sensorsData: Record<string, CityData> = {
  gdansk: {
    name: "Gdańsk",
    coordinates: {
      lat: 54.352,
      lon: 18.6466
    },
    sensors: [
      {
        iconType: "temperature",
        name: "Temp",
        value: "0",
        unit: "°C",
        status: "Good",
        description: sensorDescriptions.temp,
      },
      {
        iconType: "co2",
        name: "CO₂",
        value: "508",
        unit: "ppm",
        status: "Good",
        description: sensorDescriptions.co2,
      },
      {
        iconType: "voc",
        name: "VOC",
        value: "48",
        unit: "ppb",
        status: "Good",
        description: sensorDescriptions.voc,
      },
      {
        iconType: "pm25",
        name: "PM 2.5",
        value: "12",
        unit: "µg/m³",
        status: "Good",
        description: sensorDescriptions.pm25,
      },
      {
        iconType: "pm10",
        name: "PM10",
        value: "15",
        unit: "µg/m³",
        status: "Good",
        description: sensorDescriptions.pm10,
      },
      {
        iconType: "humidity",
        name: "Humidity",
        value: "45",
        unit: "%",
        status: "Good",
        description: sensorDescriptions.humidity,
      },
      {
        iconType: "noise",
        name: "Noise",
        value: "52",
        unit: "dBA",
        status: "Warning",
        description: sensorDescriptions.noise,
      },
      {
        iconType: "pressure",
        name: "Pressure",
        value: "1013",
        unit: "hPa",
        status: "Good",
        description: sensorDescriptions.pressure,
      },
      {
        iconType: "light",
        name: "Light",
        value: "75",
        unit: "%",
        status: "Good",
        description: sensorDescriptions.light,
      },
    ],
  },
  gdynia: {
    name: "Gdynia",
    coordinates: {
      lat: 54.5189,
      lon: 18.5305
    },
    sensors: [
      {
        iconType: "temperature",
        name: "Temp",
        value: "0",
        unit: "°C",
        status: "Good",
        description: sensorDescriptions.temp,
      },
      {
        iconType: "co2",
        name: "CO₂",
        value: "485",
        unit: "ppm",
        status: "Good",
        description: sensorDescriptions.co2,
      },
      {
        iconType: "voc",
        name: "VOC",
        value: "52",
        unit: "ppb",
        status: "Warning",
        description: sensorDescriptions.voc,
      },
      {
        iconType: "pm25",
        name: "PM 2.5",
        value: "8",
        unit: "µg/m³",
        status: "Good",
        description: sensorDescriptions.pm25,
      },
      {
        iconType: "pm10",
        name: "PM10",
        value: "11",
        unit: "µg/m³",
        status: "Good",
        description: sensorDescriptions.pm10,
      },
      {
        iconType: "humidity",
        name: "Humidity",
        value: "55",
        unit: "%",
        status: "Good",
        description: sensorDescriptions.humidity,
      },
      {
        iconType: "noise",
        name: "Noise",
        value: "48",
        unit: "dBA",
        status: "Good",
        description: sensorDescriptions.noise,
      },
      {
        iconType: "pressure",
        name: "Pressure",
        value: "1015",
        unit: "hPa",
        status: "Good",
        description: sensorDescriptions.pressure,
      },
      {
        iconType: "light",
        name: "Light",
        value: "82",
        unit: "%",
        status: "Good",
        description: sensorDescriptions.light,
      },
    ],
  },
  sopot: {
    name: "Sopot",
    coordinates: {
      lat: 54.352,
      lon: 18.6466
    },
    sensors: [
      {
        iconType: "temperature",
        name: "Temp",
        value: "0",
        unit: "°C",
        status: "Good",
        description: sensorDescriptions.temp,
      },
      {
        iconType: "co2",
        name: "CO₂",
        value: "495",
        unit: "ppm",
        status: "Good",
        description: sensorDescriptions.co2,
      },
      {
        iconType: "voc",
        name: "VOC",
        value: "45",
        unit: "ppb",
        status: "Good",
        description: sensorDescriptions.voc,
      },
      {
        iconType: "pm25",
        name: "PM 2.5",
        value: "10",
        unit: "µg/m³",
        status: "Good",
        description: sensorDescriptions.pm25,
      },
      {
        iconType: "pm10",
        name: "PM10",
        value: "13",
        unit: "µg/m³",
        status: "Good",
        description: sensorDescriptions.pm10,
      },
      {
        iconType: "humidity",
        name: "Humidity",
        value: "50",
        unit: "%",
        status: "Good",
        description: sensorDescriptions.humidity,
      },
      {
        iconType: "noise",
        name: "Noise",
        value: "43",
        unit: "dBA",
        status: "Good",
        description: sensorDescriptions.noise,
      },
      {
        iconType: "pressure",
        name: "Pressure",
        value: "1014",
        unit: "hPa",
        status: "Good",
        description: sensorDescriptions.pressure,
      },
      {
        iconType: "light",
        name: "Light",
        value: "68",
        unit: "%",
        status: "Good",
        description: sensorDescriptions.light,
      },
    ],
  },
  slupsk: {
    name: "Słupsk",
    coordinates: {
      lat: 54.352,
      lon: 18.6466
    },
    sensors: [
      {
        iconType: "temperature",
        name: "Temp",
        value: "0",
        unit: "°C",
        status: "Good",
        description: sensorDescriptions.temp,
      },
      {
        iconType: "co2",
        name: "CO₂",
        value: "490",
        unit: "ppm",
        status: "Good",
        description: sensorDescriptions.co2,
      },
      {
        iconType: "voc",
        name: "VOC",
        value: "47",
        unit: "ppb",
        status: "Good",
        description: sensorDescriptions.voc,
      },
      {
        iconType: "pm25",
        name: "PM 2.5",
        value: "11",
        unit: "µg/m³",
        status: "Good",
        description: sensorDescriptions.pm25,
      },
      {
        iconType: "pm10",
        name: "PM10",
        value: "14",
        unit: "µg/m³",
        status: "Good",
        description: sensorDescriptions.pm10,
      },
      {
        iconType: "humidity",
        name: "Humidity",
        value: "52",
        unit: "%",
        status: "Good",
        description: sensorDescriptions.humidity,
      },
      {
        iconType: "noise",
        name: "Noise",
        value: "45",
        unit: "dBA",
        status: "Good",
        description: sensorDescriptions.noise,
      },
      {
        iconType: "pressure",
        name: "Pressure",
        value: "1012",
        unit: "hPa",
        status: "Good",
        description: sensorDescriptions.pressure,
      },
      {
        iconType: "light",
        name: "Light",
        value: "70",
        unit: "%",
        status: "Good",
        description: sensorDescriptions.light,
      },
    ],
  },
  ustka: {
    name: "Ustka",
    coordinates: {
      lat: 54.352,
      lon: 18.6466
    },
    sensors: [
      {
        iconType: "temperature",
        name: "Temp",
        value: "0",
        unit: "°C",
        status: "Good",
        description: sensorDescriptions.temp,
      },
      {
        iconType: "co2",
        name: "CO₂",
        value: "475",
        unit: "ppm",
        status: "Good",
        description: sensorDescriptions.co2,
      },
      {
        iconType: "voc",
        name: "VOC",
        value: "44",
        unit: "ppb",
        status: "Good",
        description: sensorDescriptions.voc,
      },
      {
        iconType: "pm25",
        name: "PM 2.5",
        value: "9",
        unit: "µg/m³",
        status: "Good",
        description: sensorDescriptions.pm25,
      },
      {
        iconType: "pm10",
        name: "PM10",
        value: "12",
        unit: "µg/m³",
        status: "Good",
        description: sensorDescriptions.pm10,
      },
      {
        iconType: "humidity",
        name: "Humidity",
        value: "58",
        unit: "%",
        status: "Good",
        description: sensorDescriptions.humidity,
      },
      {
        iconType: "noise",
        name: "Noise",
        value: "42",
        unit: "dBA",
        status: "Good",
        description: sensorDescriptions.noise,
      },
      {
        iconType: "pressure",
        name: "Pressure",
        value: "1011",
        unit: "hPa",
        status: "Good",
        description: sensorDescriptions.pressure,
      },
      {
        iconType: "light",
        name: "Light",
        value: "65",
        unit: "%",
        status: "Good",
        description: sensorDescriptions.light,
      },
    ],
  },
};
