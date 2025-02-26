
import { AirQualityData } from '@/types/company';

const formatValue = (value: number | undefined, unit: string) => {
  if (value === undefined) return 'brak danych';
  return `${value.toFixed(1)} ${unit}`;
};

export const createMarkerPopup = (data: AirQualityData) => {
  const { source, current } = data;
  const index = current.indexes?.[0];

  // Calculate background color and text classes based on air quality
  const getColorClasses = (index: any) => {
    if (!index) return ['bg-gray-500/15', 'text-gray-300'];
    
    const value = index.value;
    if (value <= 25) return ['bg-emerald-500/15', 'text-emerald-300'];
    if (value <= 50) return ['bg-yellow-500/15', 'text-yellow-300'];
    if (value <= 75) return ['bg-orange-500/15', 'text-orange-300'];
    return ['bg-red-500/15', 'text-red-300'];
  };

  const [bgClass, textClass] = getColorClasses(index);

  return `
    <div class="p-4 font-['Montserrat']">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-lg text-white">
          ${source.name}
        </h3>
        <span class="text-sm font-medium text-gray-400">${source.provider}</span>
      </div>
      
      <div class="p-3 rounded-lg mb-4 ${bgClass}">
        <div class="font-bold text-lg ${textClass}">
          ${index?.description || 'Brak danych o jakości powietrza'}
        </div>
        ${index?.advice ? `<div class="text-sm mt-1 text-gray-300">${index.advice}</div>` : ''}
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-400">PM2.5</div>
            <div class="text-lg font-semibold text-white">${formatValue(current.pm25, 'µg/m³')}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400">PM10</div>
            <div class="text-lg font-semibold text-white">${formatValue(current.pm10, 'µg/m³')}</div>
          </div>
          ${current.no2 ? `
          <div>
            <div class="text-sm text-gray-400">NO₂</div>
            <div class="text-lg font-semibold text-white">${formatValue(current.no2, 'µg/m³')}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="space-y-3">
          ${current.temperature ? `
          <div>
            <div class="text-sm text-gray-400">Temperatura</div>
            <div class="text-lg font-semibold text-white">${formatValue(current.temperature, '°C')}</div>
          </div>
          ` : ''}
          ${current.humidity ? `
          <div>
            <div class="text-sm text-gray-400">Wilgotność</div>
            <div class="text-lg font-semibold text-white">${formatValue(current.humidity, '%')}</div>
          </div>
          ` : ''}
          ${current.pressure ? `
          <div>
            <div class="text-sm text-gray-400">Ciśnienie</div>
            <div class="text-lg font-semibold text-white">${formatValue(current.pressure, 'hPa')}</div>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="text-xs text-gray-400 mt-4">
        Ostatnia aktualizacja: ${new Date(current.timestamp).toLocaleString()}
      </div>
    </div>
  `;
};
