
import React, { useEffect } from 'react';

export const MapStyles: React.FC = () => {
  useEffect(() => {
    // Add global styles for the map
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-popup-content-wrapper {
        background: rgba(26, 31, 44, 0.95);
        color: white;
        border-radius: 12px;
        backdrop-filter: blur(8px);
      }

      .leaflet-popup-tip {
        background: rgba(26, 31, 44, 0.95);
      }

      .leaflet-container {
        font-family: 'Montserrat', sans-serif;
      }

      .dark-map-tiles {
        filter: brightness(0.8) saturate(1.2);
      }

      .airly-popup .leaflet-popup-content {
        margin: 0;
        min-width: 280px;
      }

      @media (max-width: 640px) {
        .airly-popup .leaflet-popup-content {
          min-width: 240px;
        }
      }
    `;
    document.head.appendChild(style);

    // Clean up
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};
