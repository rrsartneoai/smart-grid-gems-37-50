import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Droplets, AlertTriangle } from "lucide-react";

interface AirQualityProps {
  data: {
    list: Array<{
      main: {
        aqi: number;
      };
      components: {
        co: number;
        no2: number;
        o3: number;
        pm2_5: number;
        pm10: number;
        so2: number;
      };
    }>;
  };
}

const getAQILevel = (aqi: number) => {
  switch (aqi) {
    case 1:
      return { label: "Bardzo dobra", color: "text-green-500" };
    case 2:
      return { label: "Dobra", color: "text-green-400" };
    case 3:
      return { label: "Umiarkowana", color: "text-yellow-500" };
    case 4:
      return { label: "Zła", color: "text-orange-500" };
    case 5:
      return { label: "Bardzo zła", color: "text-red-500" };
    default:
      return { label: "Brak danych", color: "text-gray-500" };
  }
};

export const AirQuality = ({ data }: AirQualityProps) => {
  const { t } = useTranslation();
  const currentData = data.list[0];
  const aqiInfo = getAQILevel(currentData.main.aqi);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Wind className="h-5 w-5" />
          {t("airQuality")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className={`flex items-center gap-2 ${aqiInfo.color}`}>
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">{aqiInfo.label}</span>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span>PM2.5:</span>
              <span className="font-semibold">{currentData.components.pm2_5} µg/m³</span>
            </div>
            <div className="flex items-center justify-between">
              <span>PM10:</span>
              <span className="font-semibold">{currentData.components.pm10} µg/m³</span>
            </div>
            <div className="flex items-center justify-between">
              <span>O₃:</span>
              <span className="font-semibold">{currentData.components.o3} µg/m³</span>
            </div>
            <div className="flex items-center justify-between">
              <span>NO₂:</span>
              <span className="font-semibold">{currentData.components.no2} µg/m³</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SO₂:</span>
              <span className="font-semibold">{currentData.components.so2} µg/m³</span>
            </div>
            <div className="flex items-center justify-between">
              <span>CO:</span>
              <span className="font-semibold">{currentData.components.co} µg/m³</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};