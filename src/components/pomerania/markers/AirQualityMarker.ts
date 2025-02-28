
import L from 'leaflet';
import { AirlyInstallation } from '../types';

export const createAirQualityMarker = (installation: AirlyInstallation) => {
  const { location } = installation;
  const marker = L.marker([location.latitude, location.longitude]);

  // Create a custom marker icon
  marker.setIcon(L.divIcon({
    className: 'custom-div-icon',
    html: `<div 
      style="
        width: 32px;
        height: 32px;
        background-color: #3b82f6;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: sans-serif;
        font-size: 12px;
        font-weight: bold;
      "
      role="img"
      aria-label="Airly sensor"
    ></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  }));

  return marker;
};
