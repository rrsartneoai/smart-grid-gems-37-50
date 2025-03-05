
import { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { AirQualityData } from '@/types/company';
import { MAP_CONFIG } from '../config/mapConfig';
import { createAirQualityMarker } from '../markers/AirQualityMarker';
import { AQICN_STATIONS } from './AirQualityStations';

export interface UseAirlyMapState {
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    loaded: number;
  };
  selectedStation: AirQualityData | null;
  isDetailDialogOpen: boolean;
  setIsDetailDialogOpen: (isOpen: boolean) => void;
  handleCloseDetailDialog: () => void;
}

export const useAirlyMap = () => {
  // Refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const popupRef = useRef<L.Popup | null>(null);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: AQICN_STATIONS.length, loaded: 0 });
  const [selectedStation, setSelectedStation] = useState<AirQualityData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      setIsLoading(true);
      setError(null);
      setStats({ total: AQICN_STATIONS.length, loaded: 0 });

      try {
        // Initialize the map
        console.log('Initializing map...');
        const map = L.map(mapRef.current, {
          center: MAP_CONFIG.center,
          zoom: MAP_CONFIG.zoom,
          minZoom: MAP_CONFIG.minZoom,
          maxZoom: MAP_CONFIG.maxZoom,
          zoomControl: false,
          attributionControl: true
        });

        // Set bounds to restrict the view to Tricity area
        map.setMaxBounds(MAP_CONFIG.bounds);

        // Add a dark theme map layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '©OpenStreetMap, ©CartoDB, ©AQICN',
          subdomains: 'abcd',
          className: 'dark-map-tiles'
        }).addTo(map);

        // Add zoom control to bottom right
        L.control.zoom({
          position: 'bottomright'
        }).addTo(map);

        // Close popup when opening another one
        map.on('popupopen', function(e) {
          if (popupRef.current && popupRef.current !== e.popup) {
            map.closePopup(popupRef.current);
          }
          popupRef.current = e.popup;
        });

        mapInstance.current = map;
        console.log('Map initialized successfully');

        // Process static AQICN station data
        for (const station of AQICN_STATIONS) {
          try {
            const data = {
              source: {
                id: `aqicn-${station.id}`,
                name: `${station.name} ${station.address?.street || ''}`,
                provider: 'AQICN',
                location: station.location
              },
              current: {
                ...station.current,
                provider: 'AQICN',
                timestamp: station.current.fromDateTime
              }
            };

            const marker = createAirQualityMarker(data, map);
            
            // Add click handler to open the detailed dialog
            marker.on('click', () => {
              setSelectedStation(marker.options.data);
              setIsDetailDialogOpen(true);
            });
            
            markersRef.current.push(marker);
            setStats(prev => ({ ...prev, loaded: prev.loaded + 1 }));
          } catch (error) {
            console.error(`Error processing station ${station.id}:`, error);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Wystąpił błąd podczas ładowania danych. Spróbuj odświeżyć stronę.');
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (mapInstance.current) {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
  };

  return {
    mapRef,
    isLoading,
    error,
    stats,
    selectedStation,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    handleCloseDetailDialog
  };
};
