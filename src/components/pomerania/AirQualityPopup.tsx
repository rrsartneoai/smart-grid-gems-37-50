import React from 'react';
import { AirlyInstallation } from './types';

interface AirQualityPopupProps {
  installation: AirlyInstallation;
}

export const AirQualityPopup: React.FC<AirQualityPopupProps> = ({ installation }) => {
  const { address } = installation;
  
  return (
    <div className="p-4">
      <h3 className="font-bold text-lg">{address?.displayAddress1 || 'Stacja pomiarowa Airly'}</h3>
      <p className="text-sm text-gray-500">{address?.city || ''} {address?.street || ''}</p>
      <div className="mt-2">
        <p>Szczegółowe dane będą dostępne po kliknięciu w marker.</p>
      </div>
    </div>
  );
};

// Keep the string version for compatibility with Leaflet's bindPopup which expects HTML
export const createAirQualityPopup = (installation: AirlyInstallation): string => {
  const { address } = installation;
  
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
