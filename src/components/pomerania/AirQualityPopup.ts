
import { AirQualityData } from '@/types/company';

const formatValue = (value: number | undefined, unit: string) => {
  if (value === undefined || value === null) return 'brak danych';
  return `${value.toFixed(1)} ${unit}`;
};

const getPercentageClass = (percent: number | undefined) => {
  if (!percent) return '';
  if (percent <= 50) return 'text-emerald-300';
  if (percent <= 100) return 'text-yellow-300';
  if (percent <= 150) return 'text-orange-300';
  return 'text-red-300';
};

const getStandardPercentage = (data: any, pollutant: string) => {
  if (!data.standards) return null;
  const standard = data.standards.find((s: any) => s.pollutant === pollutant);
  return standard?.percent;
};

const getWindDirection = (degrees: number | undefined) => {
  if (degrees === undefined) return '';
  
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
  const index = Math.round((degrees % 360) / 45);
  return directions[index];
};

export const createMarkerPopup = (data: AirQualityData) => {
  const { source, current } = data;
  const index = current.indexes?.[0];
  const lastUpdate = new Date(current.timestamp).toLocaleString();
  
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
  
  // Calculate percentages from standards
  const pm25Percent = getStandardPercentage(current, 'PM25');
  const pm10Percent = getStandardPercentage(current, 'PM10');

  // Format wind direction
  const windDirection = getWindDirection(current.windDirection || current.windHeading);

  return `
    <div class="p-4 font-['Montserrat'] max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-lg text-white">${source.name}</h3>
        <span class="text-sm font-medium text-gray-400">${source.provider}</span>
      </div>
      
      <div class="p-3 rounded-lg mb-4 ${bgClass}">
        <div class="font-bold text-lg ${textClass}">
          ${index ? index.description : 'Cóż... Bywało lepiej.'}
        </div>
        ${index?.advice ? `
          <div class="text-sm mt-1 text-gray-300">
            ${index.advice}
          </div>
        ` : ''}
      </div>
      
      <div class="mb-4">
        <h4 class="text-sm uppercase font-semibold text-gray-400 mb-2 border-b border-gray-700 pb-1">Pyły</h4>
        <div class="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <div class="text-sm text-gray-400">PM10</div>
            <div class="flex items-baseline">
              <div class="text-lg font-semibold text-white mr-2">
                ${formatValue(current.pm10, 'µg/m³')}
              </div>
              ${pm10Percent ? `
                <div class="text-xs ${getPercentageClass(pm10Percent)}">
                  ${pm10Percent}%
                </div>
              ` : ''}
            </div>
          </div>

          <div>
            <div class="text-sm text-gray-400">PM2.5</div>
            <div class="flex items-baseline">
              <div class="text-lg font-semibold text-white mr-2">
                ${formatValue(current.pm25, 'µg/m³')}
              </div>
              ${pm25Percent ? `
                <div class="text-xs ${getPercentageClass(pm25Percent)}">
                  ${pm25Percent}%
                </div>
              ` : ''}
            </div>
          </div>

          ${current.pm1 ? `
            <div>
              <div class="text-sm text-gray-400">PM1</div>
              <div class="text-lg font-semibold text-white">
                ${formatValue(current.pm1, 'µg/m³')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="mb-4">
        <h4 class="text-sm uppercase font-semibold text-gray-400 mb-2 border-b border-gray-700 pb-1">Dane pogodowe</h4>
        <div class="grid grid-cols-2 gap-x-6 gap-y-4">
          ${current.temperature ? `
            <div>
              <div class="text-sm text-gray-400">Temperatura</div>
              <div class="text-lg font-semibold text-white">
                ${formatValue(current.temperature, '°C')}
              </div>
            </div>
          ` : ''}

          ${current.humidity ? `
            <div>
              <div class="text-sm text-gray-400">Wilgotność</div>
              <div class="text-lg font-semibold text-white">
                ${formatValue(current.humidity, '%')}
              </div>
            </div>
          ` : ''}

          ${current.pressure ? `
            <div>
              <div class="text-sm text-gray-400">Ciśnienie</div>
              <div class="text-lg font-semibold text-white">
                ${formatValue(current.pressure, 'hPa')}
              </div>
            </div>
          ` : ''}

          ${(current.windSpeed || current.windDirection || current.windHeading) ? `
            <div>
              <div class="text-sm text-gray-400">Wiatr</div>
              <div class="text-lg font-semibold text-white">
                ${windDirection} ${formatValue(current.windSpeed || 0, 'km/h')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="mb-4">
        <h4 class="text-sm uppercase font-semibold text-gray-400 mb-2 border-b border-gray-700 pb-1">Gazy</h4>
        <div class="grid grid-cols-2 gap-x-6 gap-y-4">
          ${current.no2 ? `
            <div>
              <div class="text-sm text-gray-400">NO₂</div>
              <div class="text-lg font-semibold text-white">
                ${formatValue(current.no2, 'µg/m³')}
              </div>
            </div>
          ` : ''}

          ${current.o3 ? `
            <div>
              <div class="text-sm text-gray-400">O₃</div>
              <div class="text-lg font-semibold text-white">
                ${formatValue(current.o3, 'µg/m³')}
              </div>
            </div>
          ` : ''}

          ${current.so2 ? `
            <div>
              <div class="text-sm text-gray-400">SO₂</div>
              <div class="text-lg font-semibold text-white">
                ${formatValue(current.so2, 'µg/m³')}
              </div>
            </div>
          ` : ''}

          ${current.co ? `
            <div>
              <div class="text-sm text-gray-400">CO</div>
              <div class="text-lg font-semibold text-white">
                ${formatValue(current.co, 'mg/m³')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="text-xs text-gray-400 mt-4">
        Ostatnia aktualizacja: ${lastUpdate}
      </div>
    </div>
  `;
};
