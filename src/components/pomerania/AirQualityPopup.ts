
import { Installation, Measurement } from './types';

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
    <div class="p-4 min-w-[300px]">
      <h3 class="font-bold text-lg mb-2">
        ${installation.address.street || ''} ${installation.address.streetNumber || ''}, 
        ${installation.address.city || ''}
      </h3>
      <div class="p-2 rounded mb-2" style="background-color: ${color}20;">
        <div class="font-bold" style="color: ${color}">${quality}</div>
        <div class="text-sm">${advice}</div>
      </div>
      <div class="grid grid-cols-2 gap-2 mt-4">
        <div class="space-y-2">
          <p><span class="font-bold">PM1:</span> ${getValue('PM1')} µg/m³</p>
          <p><span class="font-bold">PM2.5:</span> ${getValue('PM25')} µg/m³</p>
          <p><span class="font-bold">PM10:</span> ${getValue('PM10')} µg/m³</p>
        </div>
        <div class="space-y-2">
          <p><span class="font-bold">Temperatura:</span> ${getValue('TEMPERATURE')}°C</p>
          <p><span class="font-bold">Wilgotność:</span> ${getValue('HUMIDITY')}%</p>
          <p><span class="font-bold">Ciśnienie:</span> ${getValue('PRESSURE')} hPa</p>
        </div>
      </div>
      <div class="text-xs text-gray-500 mt-2">
        Ostatnia aktualizacja: ${new Date(measurements.current.fromDateTime).toLocaleString()}
      </div>
    </div>
  `;
};
