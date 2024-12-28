import { Thermometer, Cloud, Wind, Atom, Droplet, Volume2, Gauge, Sun } from "lucide-react";

export interface SensorData {
  icon: React.ReactNode;
  name: string;
  value: string;
  unit: string;
  status: "Good" | "Warning";
}

export interface CityData {
  name: string;
  sensors: SensorData[];
}

export const sensorsData: Record<string, CityData> = {
  gdansk: {
    name: "Gdańsk",
    sensors: [
      {
        icon: <Thermometer className="w-5 h-5" />,
        name: "Temp",
        value: "21.5",
        unit: "°C",
        status: "Good",
      },
      {
        icon: <Cloud className="w-5 h-5" />,
        name: "CO₂",
        value: "508",
        unit: "ppm",
        status: "Good",
      },
      {
        icon: <Wind className="w-5 h-5" />,
        name: "VOC",
        value: "48",
        unit: "ppb",
        status: "Good",
      },
      {
        icon: <Atom className="w-5 h-5" />,
        name: "PM 2.5",
        value: "12",
        unit: "µg/m³",
        status: "Good",
      },
      {
        icon: <Atom className="w-5 h-5" />,
        name: "PM10",
        value: "15",
        unit: "µg/m³",
        status: "Good",
      },
      {
        icon: <Droplet className="w-5 h-5" />,
        name: "Humidity",
        value: "45",
        unit: "%",
        status: "Good",
      },
      {
        icon: <Volume2 className="w-5 h-5" />,
        name: "Noise",
        value: "52",
        unit: "dBA",
        status: "Warning",
      },
      {
        icon: <Gauge className="w-5 h-5" />,
        name: "Pressure",
        value: "1013",
        unit: "hPa",
        status: "Good",
      },
      {
        icon: <Sun className="w-5 h-5" />,
        name: "Light",
        value: "75",
        unit: "%",
        status: "Good",
      },
    ],
  },
  gdynia: {
    name: "Gdynia",
    sensors: [
      {
        icon: <Thermometer className="w-5 h-5" />,
        name: "Temp",
        value: "19.8",
        unit: "°C",
        status: "Good",
      },
      {
        icon: <Cloud className="w-5 h-5" />,
        name: "CO₂",
        value: "485",
        unit: "ppm",
        status: "Good",
      },
      {
        icon: <Wind className="w-5 h-5" />,
        name: "VOC",
        value: "52",
        unit: "ppb",
        status: "Warning",
      },
      {
        icon: <Atom className="w-5 h-5" />,
        name: "PM 2.5",
        value: "8",
        unit: "µg/m³",
        status: "Good",
      },
      {
        icon: <Atom className="w-5 h-5" />,
        name: "PM10",
        value: "11",
        unit: "µg/m³",
        status: "Good",
      },
      {
        icon: <Droplet className="w-5 h-5" />,
        name: "Humidity",
        value: "55",
        unit: "%",
        status: "Good",
      },
      {
        icon: <Volume2 className="w-5 h-5" />,
        name: "Noise",
        value: "48",
        unit: "dBA",
        status: "Good",
      },
      {
        icon: <Gauge className="w-5 h-5" />,
        name: "Pressure",
        value: "1015",
        unit: "hPa",
        status: "Good",
      },
      {
        icon: <Sun className="w-5 h-5" />,
        name: "Light",
        value: "82",
        unit: "%",
        status: "Good",
      },
    ],
  },
  sopot: {
    name: "Sopot",
    sensors: [
      {
        icon: <Thermometer className="w-5 h-5" />,
        name: "Temp",
        value: "20.2",
        unit: "°C",
        status: "Good",
      },
      {
        icon: <Cloud className="w-5 h-5" />,
        name: "CO₂",
        value: "495",
        unit: "ppm",
        status: "Good",
      },
      {
        icon: <Wind className="w-5 h-5" />,
        name: "VOC",
        value: "45",
        unit: "ppb",
        status: "Good",
      },
      {
        icon: <Atom className="w-5 h-5" />,
        name: "PM 2.5",
        value: "10",
        unit: "µg/m³",
        status: "Good",
      },
      {
        icon: <Atom className="w-5 h-5" />,
        name: "PM10",
        value: "13",
        unit: "µg/m³",
        status: "Good",
      },
      {
        icon: <Droplet className="w-5 h-5" />,
        name: "Humidity",
        value: "50",
        unit: "%",
        status: "Good",
      },
      {
        icon: <Volume2 className="w-5 h-5" />,
        name: "Noise",
        value: "43",
        unit: "dBA",
        status: "Good",
      },
      {
        icon: <Gauge className="w-5 h-5" />,
        name: "Pressure",
        value: "1014",
        unit: "hPa",
        status: "Good",
      },
      {
        icon: <Sun className="w-5 h-5" />,
        name: "Light",
        value: "68",
        unit: "%",
        status: "Good",
      },
    ],
  },
  slupsk: {
    name: "Słupsk",
    sensors: [
      {
        icon: <Thermometer className="w-5 h-5" />,
        name: "Temp",
        value: "19.5",
        unit: "°C",
        status: "Good",
      },
      {
        icon: <Cloud className="w-5 h-5" />,
        name: "CO₂",
        value: "490",
        unit: "ppm",
        status: "Good",
      },
      {
        icon: <Wind className="w-5 h-5" />,
        name: "VOC",
        value: "47",
        unit: "ppb",
        status: "Good",
      },
      {
        icon: <Atom className="w-5 h-5" />,
        name: "PM 2.5",
        value: "11",
        unit: "µg/m³",
        status: "Good",
      },
      {
        icon: <Atom className="w-5 h-5" />,
        name: "PM10",
        value: "14",
        unit: "µg/m³",
        status: "Good",
      },
      {
        icon: <Droplet className="w-5 h-5" />,
        name: "Humidity",
        value: "52",
        unit: "%",
        status: "Good",
      },
      {
        icon: <Volume2 className="w-5 h-5" />,
        name: "Noise",
        value: "45",
        unit: "dBA",
        status: "Good",
      },
      {
        icon: <Gauge className="w-5 h-5" />,
        name: "Pressure",
        value: "1012",
        unit: "hPa",
        status: "Good",
      },
      {
        icon: <Sun className="w-5 h-5" />,
        name: "Light",
        value: "70",
        unit: "%",
        status: "Good",
      },
    ],
  },
  ustka: {
    name: "Ustka",
    sensors: [
      {
        icon: <Thermometer className="w-5 h-5" />,
        name: "Temp",
        value: "19.2",
        unit: "°C",
        status: "Good",
      },
      {
        icon: <Cloud className="w-5 h-5" />,
        name: "CO₂",
        value: "475",
        unit: "ppm",
        status: "Good",
      },
      {
        icon: <Wind className="w-5 h-5" />,
        name: "VOC",
        value: "44",
        unit: "ppb",
        status: "Good",
      },
      {
        icon: <Atom className="w-5 h-5" />,
        name: "PM 2.5",
        value: "9",
        unit: "µg/m³",
        status: "Good",
      },
      {
        icon: <Atom className="w-5 h-5" />,
        name: "PM10",
        value: "12",
        unit: "µg/m³",
        status: "Good",
      },
      {
        icon: <Droplet className="w-5 h-5" />,
        name: "Humidity",
        value: "58",
        unit: "%",
        status: "Good",
      },
      {
        icon: <Volume2 className="w-5 h-5" />,
        name: "Noise",
        value: "42",
        unit: "dBA",
        status: "Good",
      },
      {
        icon: <Gauge className="w-5 h-5" />,
        name: "Pressure",
        value: "1011",
        unit: "hPa",
        status: "Good",
      },
      {
        icon: <Sun className="w-5 h-5" />,
        name: "Light",
        value: "65",
        unit: "%",
        status: "Good",
      },
    ],
  },
};
