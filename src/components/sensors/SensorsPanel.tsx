import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Thermometer,
  Cloud,
  Wind,
  Atom,
  Droplet,
  Volume2,
  Gauge,
  Sun,
} from "lucide-react";

const SensorsPanel = () => {
  const sensors = [
    {
      icon: <Thermometer className="w-5 h-5" />,
      name: "Temp",
      value: "21.5",
      unit: "°",
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
      value: "8",
      unit: "µg/m³",
      status: "Good",
    },
    {
      icon: <Atom className="w-5 h-5" />,
      name: "PM10",
      value: "8",
      unit: "µg/m³",
      status: "Good",
    },
    {
      icon: <Droplet className="w-5 h-5" />,
      name: "Humidity",
      value: "33",
      unit: "%",
      status: "Good",
    },
    {
      icon: <Volume2 className="w-5 h-5" />,
      name: "Noise",
      value: "43",
      unit: "dBA",
      status: "",
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      name: "Pressure",
      value: "1034",
      unit: "hPa",
      status: "",
    },
    {
      icon: <Sun className="w-5 h-5" />,
      name: "Rel light",
      value: "0",
      unit: "%",
      status: "",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Czujniki</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Last synced in an hour</span>
          <span>•</span>
          <span>100% est. battery</span>
          <span>•</span>
          <span>-71 dBm</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">{sensor.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {sensor.name}
                  </span>
                  {sensor.status && (
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 border-green-500/20"
                    >
                      {sensor.status}
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-semibold">{sensor.value}</span>
                  <span className="text-sm text-muted-foreground">
                    {sensor.unit}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SensorsPanel;