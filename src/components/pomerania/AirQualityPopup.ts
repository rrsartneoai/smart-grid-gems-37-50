
import { AirQualityData } from '@/types/company';

const formatValue = (value: number | undefined, unit: string) => {
  if (value === undefined) return 'brak danych';
  return `${value.toFixed(1)} ${unit}`;
};

export const createMarkerPopup = (data: AirQualityData) => {
  const { source, current } = data;

  // Calculate background color based on PM2.5 or PM10
  let backgroundColor = '#f0f0f0';
  let textColor = '#666666';
  let quality = 'Brak danych';

  if (current.pm25 !== undefined) {
    const value = current.pm25;
    if (value <= 10) {
      backgroundColor = '#34D399';
      textColor = '#065F46';
      quality = 'Bardzo dobra';
    } else if (value <= 25) {
      backgroundColor = '#FBBF24';
      textColor = '#92400E';
      quality = 'Dobra';
    } else if (value <= 50) {
      backgroundColor = '#F59E0B';
      textColor = '#92400E';
      quality = 'Umiarkowana';
    } else {
      backgroundColor = '#EF4444';
      textColor = '#991B1B';
      quality = 'Zła';
    }
  }

  return `
    <div class="p-4 min-w-[400px] font-['Montserrat']">
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-bold text-xl text-gray-800">
          ${source.name}
        </h3>
        <span class="text-sm font-medium text-gray-500">${source.provider}</span>
      </div>
      
      <div class="p-3 rounded-lg mb-4" style="background-color: ${backgroundColor}15;">
        <div class="font-bold text-lg" style="color: ${textColor}">${quality}</div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">PM2.5</div>
            <div class="text-2xl font-semibold">${formatValue(current.pm25, 'µg/m³')}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">PM10</div>
            <div class="text-2xl font-semibold">${formatValue(current.pm10, 'µg/m³')}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">NO₂</div>
            <div class="text-2xl font-semibold">${formatValue(current.no2, 'µg/m³')}</div>
          </div>
        </div>
        
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">Temperatura</div>
            <div class="text-2xl font-semibold">${formatValue(current.temperature, '°C')}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Wilgotność</div>
            <div class="text-2xl font-semibold">${formatValue(current.humidity, '%')}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Ciśnienie</div>
            <div class="text-2xl font-semibold">${formatValue(current.pressure, 'hPa')}</div>
          </div>
        </div>
      </div>

      <div class="text-xs text-gray-500 mt-4">
        Ostatnia aktualizacja: ${new Date(current.timestamp).toLocaleString()}
      </div>
    </div>
  `;
};
