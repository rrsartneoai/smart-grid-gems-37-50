
import L from 'leaflet';
import { AirQualityData } from '@/types/company';
import { createMarkerPopup } from '../AirQualityPopup';

export const createAirQualityMarker = (data: AirQualityData, map: L.Map) => {
  const { source, current } = data;
  const marker = L.marker([source.location.latitude, source.location.longitude]);

  // Get the air quality index from measurements
  const index = current.indexes?.[0];
  const color = index?.color || '#999999';
  const value = index?.value || 0;

  // Add historical data simulation if not present
  if (!data.historicalData) {
    data.historicalData = [
      {
        parameter: 'pm25',
        values: Array.from({ length: 48 }, () => Math.floor(Math.random() * 30) + 5),
        timestamps: Array.from({ length: 48 }, (_, i) => {
          const date = new Date();
          date.setHours(date.getHours() - i);
          return date.toISOString();
        }),
        min: Math.floor((data.current.pm25 || 10) * 0.6),
        max: Math.ceil((data.current.pm25 || 10) * 1.4)
      },
      {
        parameter: 'pm10',
        values: Array.from({ length: 48 }, () => Math.floor(Math.random() * 40) + 10),
        timestamps: Array.from({ length: 48 }, (_, i) => {
          const date = new Date();
          date.setHours(date.getHours() - i);
          return date.toISOString();
        }),
        min: Math.floor((data.current.pm10 || 15) * 0.6),
        max: Math.ceil((data.current.pm10 || 15) * 1.4)
      },
      {
        parameter: 'no2',
        values: Array.from({ length: 48 }, () => Math.floor(Math.random() * 15) + 2),
        timestamps: Array.from({ length: 48 }, (_, i) => {
          const date = new Date();
          date.setHours(date.getHours() - i);
          return date.toISOString();
        }),
        min: 1,
        max: 3
      },
      {
        parameter: 'so2',
        values: Array.from({ length: 48 }, () => Math.floor(Math.random() * 8) + 1),
        timestamps: Array.from({ length: 48 }, (_, i) => {
          const date = new Date();
          date.setHours(date.getHours() - i);
          return date.toISOString();
        }),
        min: 1,
        max: 2
      },
      {
        parameter: 'co',
        values: Array.from({ length: 48 }, () => Math.floor(Math.random() * 5) + 1),
        timestamps: Array.from({ length: 48 }, (_, i) => {
          const date = new Date();
          date.setHours(date.getHours() - i);
          return date.toISOString();
        }),
        min: 2,
        max: 3
      }
    ];
  }

  // Create a custom marker icon with air quality information
  marker.setIcon(L.divIcon({
    className: 'custom-div-icon',
    html: `<div 
      style="
        width: 32px;
        height: 32px;
        background-color: ${color};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: 'Montserrat', sans-serif;
        font-size: 12px;
        font-weight: bold;
      "
      role="img"
      aria-label="Air quality index: ${value}"
    >${Math.round(value)}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  }));

  // Create and bind popup with air quality information
  const popupContent = createMarkerPopup(data);
  marker.bindPopup(popupContent, {
    maxWidth: 400,
    className: 'airly-popup'
  });

  // Store the data with the marker for use in the detail dialog
  marker.options.data = data;

  marker.addTo(map);
  return marker;
};
