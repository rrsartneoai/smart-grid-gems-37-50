
import { useEffect, useRef, useState } from "react";
import L from 'leaflet';
import { fetchInstallations, fetchMeasurements } from "../airlyService";
import { fetchAllAqicnStations } from "@/services/airQuality/aqicnService";
import { Installation } from "../types";
import { MAP_CONFIG, CITIES } from "../config/mapConfig";
import { createAirQualityMarker } from "../markers/AirQualityMarker";

// Rate limiting helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useMapInitialization() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, loaded: 0 });

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      setIsLoading(true);
      setError(null);
      setStats({ total: 0, loaded: 0 });

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
          attribution: '©OpenStreetMap, ©CartoDB, ©Airly, ©AQICN',
          subdomains: 'abcd',
          className: 'dark-map-tiles'
        }).addTo(map);

        // Add zoom control to bottom right
        L.control.zoom({
          position: 'bottomright'
        }).addTo(map);

        mapInstance.current = map;
        console.log('Map initialized successfully');

        // Fetch installations for all cities
        const fetchedInstallations = await Promise.all(
          CITIES.map(city => fetchInstallations(city.lat, city.lon))
        );
        
        // Flatten and deduplicate installations by ID
        const allInstallations = Array.from(
          new Map(
            fetchedInstallations
              .flat()
              .map(install => [install.id, install])
          ).values()
        );

        // Also fetch AQICN data for all stations
        const aqicnStations = await fetchAllAqicnStations();
        
        const totalStations = allInstallations.length + aqicnStations.length;
        setStats({ total: totalStations, loaded: 0 });

        // Add AQICN stations to the map first
        for (const station of aqicnStations) {
          try {
            const marker = createAirQualityMarker(station, map);
            if (marker) markersRef.current.push(marker);
            setStats(prev => ({ ...prev, loaded: prev.loaded + 1 }));
          } catch (error) {
            console.error(`Error adding AQICN station to map:`, error);
          }
        }

        // Process Airly installations in batches to prevent rate limiting
        const batchSize = 5;
        for (let i = 0; i < allInstallations.length; i += batchSize) {
          const batch = allInstallations.slice(i, i + batchSize);
          
          await Promise.all(batch.map(async (installation: Installation) => {
            try {
              console.log(`Fetching data for installation ${installation.id}...`);
              const measurements = await fetchMeasurements(installation.id);
              
              const data = {
                source: {
                  id: `airly-${installation.id}`,
                  name: `Airly ${installation.address?.street || ''}`,
                  provider: 'Airly',
                  location: installation.location
                },
                current: {
                  ...measurements.current,
                  provider: 'Airly',
                  timestamp: measurements.current.fromDateTime
                }
              };

              const marker = createAirQualityMarker(data, map);
              if (marker) markersRef.current.push(marker);
              setStats(prev => ({ ...prev, loaded: prev.loaded + 1 }));
            } catch (error) {
              console.error(`Error processing installation ${installation.id}:`, error);
            }
          }));

          if (i + batchSize < allInstallations.length) {
            await delay(500);
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

  return { mapRef, isLoading, error, stats };
}
