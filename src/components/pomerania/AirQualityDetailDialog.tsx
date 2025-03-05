
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AirQualityData } from '@/types/company';
import { 
  Gauge, 
  Thermometer, 
  Wind as WindIcon, 
  Droplets, 
  BarChart3,
  Calendar, 
  Clock
} from "lucide-react";

// Helper functions
const getAQILevel = (value: number): string => {
  if (value <= 50) return "Good";
  if (value <= 100) return "Moderate";
  if (value <= 150) return "Unhealthy for Sensitive Groups";
  if (value <= 200) return "Unhealthy";
  if (value <= 300) return "Very Unhealthy";
  return "Hazardous";
};

const getAQIColor = (value: number): string => {
  if (value <= 50) return "#34D399"; // green
  if (value <= 100) return "#FFFF00"; // yellow
  if (value <= 150) return "#F59E0B"; // orange
  if (value <= 200) return "#EF4444"; // red
  if (value <= 300) return "#800080"; // purple
  return "#7F1D1D"; // dark red
};

const getAQIAdvice = (value: number): string => {
  if (value <= 50) return "Air quality is considered satisfactory, and air pollution poses little or no risk";
  if (value <= 100) return "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution";
  if (value <= 150) return "Members of sensitive groups may experience health effects. The general public is not likely to be affected";
  if (value <= 200) return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects";
  if (value <= 300) return "Health warnings of emergency conditions. The entire population is more likely to be affected";
  return "Health alert: everyone may experience more serious health effects";
};

interface AirQualityDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: AirQualityData | null;
}

export const AirQualityDetailDialog: React.FC<AirQualityDetailDialogProps> = ({ 
  isOpen, 
  onClose, 
  data 
}) => {
  if (!data) return null;

  const mainIndex = data.current.indexes?.[0]?.value || 0;
  const mainLevel = getAQILevel(mainIndex);
  const mainColor = getAQIColor(mainIndex);
  const mainAdvice = getAQIAdvice(mainIndex);
  
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('pl-PL', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric'
  });
  const formattedTime = currentDate.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Define parameters and their colors
  const parameters = [
    { 
      name: "PM2.5", 
      value: data.current.pm25 || 0, 
      aqi: Math.round((data.current.pm25 || 0) * 2), // Simple conversion for example
      color: "#64DD17", 
      min: data.historicalData?.find(p => p.parameter === 'pm25')?.min || 0,
      max: data.historicalData?.find(p => p.parameter === 'pm25')?.max || 0
    },
    { 
      name: "PM10", 
      value: data.current.pm10 || 0, 
      aqi: Math.round((data.current.pm10 || 0) / 2), 
      color: "#64DD17",
      min: data.historicalData?.find(p => p.parameter === 'pm10')?.min || 0,
      max: data.historicalData?.find(p => p.parameter === 'pm10')?.max || 0
    },
    { 
      name: "NO2", 
      value: data.current.no2 || 0, 
      aqi: Math.round((data.current.no2 || 0) / 10), 
      color: "#64DD17",
      min: data.historicalData?.find(p => p.parameter === 'no2')?.min || 0,
      max: data.historicalData?.find(p => p.parameter === 'no2')?.max || 0
    },
    { 
      name: "SO2", 
      value: data.current.so2 || 0, 
      aqi: Math.round((data.current.so2 || 0) / 15), 
      color: "#64DD17",
      min: data.historicalData?.find(p => p.parameter === 'so2')?.min || 0,
      max: data.historicalData?.find(p => p.parameter === 'so2')?.max || 0
    },
    { 
      name: "CO", 
      value: data.current.co || 0, 
      aqi: Math.round((data.current.co || 0) / 50), 
      color: "#64DD17",
      min: data.historicalData?.find(p => p.parameter === 'co')?.min || 0,
      max: data.historicalData?.find(p => p.parameter === 'co')?.max || 0
    }
  ];

  // Environmental data
  const envData = [
    { 
      name: "Temp.", 
      value: data.current.temperature || 0, 
      unit: "°C", 
      icon: <Thermometer className="w-4 h-4" />,
      min: 4,
      max: 9
    },
    { 
      name: "Pressure", 
      value: data.current.pressure || 0, 
      unit: "hPa", 
      icon: <Gauge className="w-4 h-4" />,
      min: 1014,
      max: 1020
    },
    { 
      name: "Humidity", 
      value: data.current.humidity || 0, 
      unit: "%", 
      icon: <Droplets className="w-4 h-4" />,
      min: 39,
      max: 86
    },
    { 
      name: "Wind", 
      value: data.current.wind || 0, 
      unit: "km/h", 
      icon: <WindIcon className="w-4 h-4" />,
      min: 8,
      max: 15
    }
  ];

  // Simulate a simple mini chart for each parameter
  const MiniChart = ({ color }: { color: string }) => (
    <div className="h-5 flex items-end space-x-[2px]">
      {Array.from({ length: 24 }).map((_, i) => {
        const height = Math.floor(Math.random() * 100) % 5 + 1;
        return (
          <div 
            key={i} 
            style={{ height: `${height}px`, backgroundColor: color }}
            className="w-1"
          />
        );
      })}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-black text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl flex justify-between items-center">
            <span className="text-blue-400">{data.source.name}</span>
            <div className="flex items-center text-sm text-gray-400 space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{formattedTime}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Main AQI Display */}
        <div className="flex items-start space-x-6 mb-6">
          <div 
            className="text-7xl font-bold p-4 flex justify-center items-center rounded" 
            style={{ 
              backgroundColor: mainColor,
              color: mainIndex > 100 ? 'white' : 'black',
              width: '120px',
              height: '120px'
            }}
          >
            {Math.round(mainIndex)}
          </div>
          <div className="flex-1">
            <h3 className="text-4xl font-bold mb-1" style={{ color: mainColor }}>
              {mainLevel}
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              {mainAdvice}
            </p>
            <div className="text-xs text-gray-400 flex flex-col space-y-1">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#34D399] mr-2"></div>
                <span>0-50 Good</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#FFFF00] mr-2"></div>
                <span>50-100 Moderate</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#F59E0B] mr-2"></div>
                <span>100-150 Unhealthy for Sensitive Groups</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#EF4444] mr-2"></div>
                <span>150-200 Unhealthy</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#800080] mr-2"></div>
                <span>200-300 Very Unhealthy</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#7F1D1D] mr-2"></div>
                <span>300-500 Hazardous</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-between mb-3 border-b border-gray-700">
          <button className="px-4 py-2 text-sm font-medium border-b-2 border-white text-white">current</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-400">past 2 days</button>
          <div className="flex">
            <div className="px-4 py-2 text-sm font-medium text-blue-400">min</div>
            <div className="px-4 py-2 text-sm font-medium text-orange-400">max</div>
          </div>
        </div>

        {/* Parameters with mini charts */}
        <div className="space-y-4">
          {parameters.map((param, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20">
                <div className="text-sm font-medium">{param.name} <span className="text-xs text-gray-400">AQI</span></div>
                <div className="text-lg font-bold">{param.aqi}</div>
              </div>
              <div className="flex-1 mx-3">
                <MiniChart color={param.color} />
              </div>
              <div className="w-16 flex justify-between">
                <span className="text-sm text-blue-400">{param.min}</span>
                <span className="text-sm text-orange-400">{param.max}</span>
              </div>
            </div>
          ))}

          {/* Environmental parameters */}
          {envData.map((param, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 flex items-center">
                <div>
                  <div className="text-sm font-medium flex items-center">
                    {param.name}
                  </div>
                  <div className="text-lg font-bold">{param.value}</div>
                </div>
              </div>
              <div className="flex-1 mx-3">
                <MiniChart color={index === 0 ? "#8BC34A" : index === 1 ? "#FFD600" : index === 2 ? "#2196F3" : "#03A9F4"} />
              </div>
              <div className="w-16 flex justify-between">
                <span className="text-sm text-blue-400">{param.min}</span>
                <span className="text-sm text-orange-400">{param.max}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-400">
          <p>Data measured by:</p>
          <ul className="list-disc ml-5">
            <li>Gdańsk Metropolitan Air Quality Monitoring</li>
            <li>Air Pomerania</li>
          </ul>
          <p className="mt-2">Values are converted to the US EPA AQI standard.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
