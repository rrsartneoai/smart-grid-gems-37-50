
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { fetchAqicnData } from "@/services/airQuality/aqicnService";

interface MetricData {
  title: string;
  value: string;
  unit: string;
  status: "Good" | "Moderate" | "Bad";
  change?: string;
  period?: string;
  subtext?: string;
}

export const AirQualitySpaces = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      title: "PM2.5",
      value: "...",
      unit: "µg/m³",
      status: "Good",
      change: "0",
      period: "ładowanie danych..."
    },
    {
      title: "PM10",
      value: "...",
      unit: "µg/m³",
      status: "Good",
      change: "0",
      period: "ładowanie danych..."
    },
    {
      title: "NO₂",
      value: "...",
      unit: "µg/m³",
      status: "Good",
      change: "0",
      period: "ładowanie danych..."
    },
    {
      title: "Dominujące zanieczyszczenie",
      value: "...",
      unit: "",
      status: "Good",
      subtext: "Ładowanie danych..."
    },
    {
      title: "Wilgotność",
      value: "...",
      unit: "%",
      status: "Good",
      subtext: "Ładowanie danych..."
    },
    {
      title: "Temperatura",
      value: "...",
      unit: "°C",
      status: "Good",
      subtext: "Ładowanie danych..."
    },
    {
      title: "Indeks jakości powietrza",
      value: "...",
      unit: "AQI",
      status: "Good",
      subtext: "Ładowanie danych..."
    },
    {
      title: "Czas aktualizacji",
      value: "...",
      unit: "",
      status: "Good",
      subtext: "Ładowanie danych..."
    }
  ]);

  useEffect(() => {
    const loadAqicnData = async () => {
      try {
        // Fetch data from the main Gdańsk Wrzeszcz station
        const mainStationId = '2684';
        const data = await fetchAqicnData(mainStationId);
        
        if (!data) {
          console.error('No data received from AQICN API');
          return;
        }
        
        // Extract values
        const pm25 = data.iaqi?.pm25?.v;
        const pm10 = data.iaqi?.pm10?.v;
        const no2 = data.iaqi?.no2?.v;
        const humidity = data.iaqi?.h?.v;
        const temperature = data.iaqi?.t?.v;
        const aqi = data.aqi;
        const dominentpol = data.dominentpol;
        
        // Format last update time
        const lastUpdate = data.time?.iso 
          ? new Date(data.time.iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
          : 'nieznany';
        
        // Format pollutant name
        const pollutantMap: Record<string, string> = {
          'pm25': 'PM2.5',
          'pm10': 'PM10',
          'no2': 'NO₂',
          'so2': 'SO₂',
          'o3': 'O₃',
          'co': 'CO'
        };
        
        const dominantPollutant = pollutantMap[dominentpol] || dominentpol || 'nieznane';
        
        // Get AQI status
        const getStatus = (value: number): "Good" | "Moderate" | "Bad" => {
          if (value <= 50) return "Good";
          if (value <= 100) return "Moderate";
          return "Bad";
        };
        
        // Update metrics
        setMetrics([
          {
            title: "PM2.5",
            value: pm25?.toFixed(1) || "N/A",
            unit: "µg/m³",
            status: pm25 ? getStatus(pm25 * 2) : "Good", // Approximate AQI conversion
            change: "+0.5",
            period: "od ostatniej godziny"
          },
          {
            title: "PM10",
            value: pm10?.toFixed(1) || "N/A",
            unit: "µg/m³",
            status: pm10 ? getStatus(pm10) : "Good",
            change: "-1.2",
            period: "od ostatniej godziny"
          },
          {
            title: "NO₂",
            value: no2?.toFixed(1) || "N/A",
            unit: "µg/m³",
            status: no2 ? getStatus(no2 * 2) : "Good", // Approximate AQI conversion
            change: "+0.3",
            period: "od ostatniego odczytu"
          },
          {
            title: "Dominujące zanieczyszczenie",
            value: dominantPollutant,
            unit: "",
            status: "Good",
            subtext: "Największy udział w pomiarze"
          },
          {
            title: "Wilgotność",
            value: humidity?.toFixed(1) || "N/A",
            unit: "%",
            status: "Good",
            subtext: humidity 
              ? (humidity > 30 && humidity < 70 ? "Optymalna wilgotność powietrza" : "Wilgotność poza optymalnym zakresem")
              : "Brak danych o wilgotności"
          },
          {
            title: "Temperatura",
            value: temperature?.toFixed(1) || "N/A",
            unit: "°C",
            status: "Good",
            subtext: "Temperatura powietrza"
          },
          {
            title: "Indeks jakości powietrza",
            value: aqi?.toString() || "N/A",
            unit: "AQI",
            status: aqi ? getStatus(aqi) : "Good",
            subtext: aqi 
              ? (aqi <= 50 ? "Dobra jakość powietrza" : aqi <= 100 ? "Umiarkowana jakość powietrza" : "Zła jakość powietrza")
              : "Brak danych o jakości powietrza"
          },
          {
            title: "Czas aktualizacji",
            value: lastUpdate,
            unit: "",
            status: "Good",
            subtext: "Ostatnia aktualizacja danych"
          }
        ]);
      } catch (error) {
        console.error('Error loading AQICN data:', error);
      }
    };
    
    loadAqicnData();
    
    // Refresh data every 15 minutes
    const intervalId = setInterval(loadAqicnData, 15 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => (
        <Card key={i} className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </p>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                {metric.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {metric.unit}
                </span>
              </h2>
              {metric.status === "Good" && (
                <span className="text-sm font-medium text-green-500">
                  Dobra
                </span>
              )}
              {metric.status === "Moderate" && (
                <span className="text-sm font-medium text-yellow-500">
                  Średnia
                </span>
              )}
              {metric.status === "Bad" && (
                <span className="text-sm font-medium text-red-500">
                  Zła
                </span>
              )}
            </div>
            {metric.change ? (
              <p className="text-xs text-muted-foreground flex items-center">
                {parseFloat(metric.change) > 0 ? (
                  <ArrowUpIcon className="w-4 h-4 text-red-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-green-500 mr-1" />
                )}
                {metric.change} {metric.period}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {metric.subtext}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
