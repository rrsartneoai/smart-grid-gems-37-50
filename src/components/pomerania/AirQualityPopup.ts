
import { AirlyInstallation } from './types';

export const createAirQualityPopup = (installation: AirlyInstallation): string => {
  const { address, location } = installation;
  
  return `
    <div class="p-4">
      <h3 class="font-bold text-lg">${address?.displayAddress1 || 'Stacja pomiarowa Airly'}</h3>
      <p class="text-sm text-gray-500">${address?.city || ''} ${address?.street || ''}</p>
      <div class="mt-2">
        <p>Szczegółowe dane będą dostępne po kliknięciu w marker.</p>
      </div>
    </div>
  `;
};
