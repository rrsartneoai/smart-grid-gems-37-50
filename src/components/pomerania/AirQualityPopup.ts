
import { Installation, Measurement } from './types';

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const createForecastChart = (forecast?: Measurement['forecast']) => {
  if (!forecast?.length) return '';
  
  const maxHeight = 40;
  const width = 20;
  const data = forecast.slice(0, 24).map(f => {
    const pm25Value = f.values.find(v => v.name === 'PM25')?.value || 0;
    const height = Math.min((pm25Value / 50) * maxHeight, maxHeight);
    const color = pm25Value <= 25 ? '#34D399' : pm25Value <= 50 ? '#FBBF24' : '#EF4444';
    return `
      <div class="flex flex-col items-center">
        <div class="text-xs text-gray-500">${formatDateTime(f.fromDateTime)}</div>
        <div class="w-${width}px bg-${color} rounded" style="height: ${height}px;"></div>
      </div>
    `;
  }).join('');

  return `
    <div class="mt-4">
      <h4 class="font-semibold mb-2">Prognoza PM2.5</h4>
      <div class="flex justify-between space-x-1">
        ${data}
      </div>
    </div>
  `;
};

export const createMarkerPopup = (installation: Installation, measurements: Measurement) => {
  const getValue = (name: string) => {
    const value = measurements.current.values.find(v => v.name === name)?.value;
    return value !== undefined ? value.toFixed(1) : 'brak danych';
  };

  const index = measurements.current.indexes[0];
  const color = index?.color || '#gray';
  const quality = index?.description || 'Brak danych';
  const advice = index?.advice || '';

  return `
    <div class="p-4 min-w-[400px] font-['Montserrat']">
      <h3 class="font-bold text-xl mb-2 text-gray-800">
        ${installation.address.street || ''} ${installation.address.streetNumber || ''}, 
        ${installation.address.city || ''}
      </h3>
      <div class="p-3 rounded-lg mb-4" style="background-color: ${color}15;">
        <div class="font-bold text-lg" style="color: ${color}">${quality}</div>
        <div class="text-sm text-gray-600">${advice}</div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">PM1</div>
            <div class="text-2xl font-semibold">${getValue('PM1')} <span class="text-sm text-gray-500">µg/m³</span></div>
          </div>
          <div>
            <div class="text-sm text-gray-500">PM2.5</div>
            <div class="text-2xl font-semibold">${getValue('PM25')} <span class="text-sm text-gray-500">µg/m³</span></div>
          </div>
          <div>
            <div class="text-sm text-gray-500">PM10</div>
            <div class="text-2xl font-semibold">${getValue('PM10')} <span class="text-sm text-gray-500">µg/m³</span></div>
          </div>
        </div>
        
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">Temperatura</div>
            <div class="text-2xl font-semibold">${getValue('TEMPERATURE')}°C</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Wilgotność</div>
            <div class="text-2xl font-semibold">${getValue('HUMIDITY')}%</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Ciśnienie</div>
            <div class="text-2xl font-semibold">${getValue('PRESSURE')} hPa</div>
          </div>
        </div>
      </div>

      ${createForecastChart(measurements.forecast)}
      
      <div class="text-xs text-gray-500 mt-4">
        Ostatnia aktualizacja: ${new Date(measurements.current.fromDateTime).toLocaleString()}
      </div>
    </div>
  `;
};
