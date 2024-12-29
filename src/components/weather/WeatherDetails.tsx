import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ThermometerSun, 
  Gauge, 
  Eye, 
  Cloud, 
  Sunrise, 
  Sunset, 
  Wind, 
  Droplet,
  CloudRain,
  Snowflake,
  Navigation
} from "lucide-react";

interface WeatherDetailsProps {
  data: {
    main: {
      feels_like: number;
      pressure: number;
      humidity: number;
    };
    visibility: number;
    clouds: {
      all: number;
    };
    sys: {
      sunrise: number;
      sunset: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    rain?: {
      "1h"?: number;
      "3h"?: number;
    };
    snow?: {
      "1h"?: number;
      "3h"?: number;
    };
  };
}

const getWindDirection = (deg: number): string => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const WeatherDetails = ({ data }: WeatherDetailsProps) => {
  const { t } = useTranslation();

  return (
    <Card className="w-full mt-4">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        <div className="flex items-center gap-2">
          <ThermometerSun className="h-5 w-5 text-blue-500" />
          <span>{t("feelsLike")}: {Math.round(data.main.feels_like)}°C</span>
        </div>

        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-blue-500" />
          <span>{t("pressure")}: {data.main.pressure} hPa</span>
        </div>

        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-500" />
          <span>{t("visibility")}: {(data.visibility / 1000).toFixed(1)} km</span>
        </div>

        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-blue-500" />
          <span>{t("cloudiness")}: {data.clouds.all}%</span>
        </div>

        <div className="flex items-center gap-2">
          <Sunrise className="h-5 w-5 text-yellow-500" />
          <span>{t("sunrise")}: {formatTime(data.sys.sunrise)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Sunset className="h-5 w-5 text-orange-500" />
          <span>{t("sunset")}: {formatTime(data.sys.sunset)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-500" 
            style={{ transform: `rotate(${data.wind.deg}deg)` }} />
          <span>{t("windDirection")}: {getWindDirection(data.wind.deg)} ({data.wind.deg}°)</span>
        </div>

        {data.wind.gust && (
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-blue-500" />
            <span>{t("windGusts")}: {Math.round(data.wind.gust * 3.6)} km/h</span>
          </div>
        )}

        {data.rain && (
          <div className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-blue-500" />
            <span>
              {t("rain1h")}: {data.rain["1h"] || 0} mm
              {data.rain["3h"] && ` (3h: ${data.rain["3h"]} mm)`}
            </span>
          </div>
        )}

        {data.snow && (
          <div className="flex items-center gap-2">
            <Snowflake className="h-5 w-5 text-blue-500" />
            <span>
              {t("snow1h")}: {data.snow["1h"] || 0} mm
              {data.snow["3h"] && ` (3h: ${data.snow["3h"]} mm)`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};