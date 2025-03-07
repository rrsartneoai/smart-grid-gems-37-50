
import { useEffect, useRef, useState } from "react";
import L from 'leaflet';
import { initializeLeafletMap } from "./mapUtils";
import { useMapDataFetching } from "./useMapDataFetching";

export function useMapInitialization() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, loaded: 0 });

  // Use the extracted data fetching hook
  const mapData = useMapDataFetching({
    map: mapInstance.current,
    markersRef: markersRef
  });

  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Initialize the map
      const map = initializeLeafletMap(mapRef.current);
      mapInstance.current = map;
      
      // Fetch data and update state
      mapData.fetchData()
        .then(() => {
          setIsLoading(mapData.isLoading);
          setError(mapData.error);
          setStats(mapData.stats);
        })
        .catch((error) => {
          console.error('Error initializing map:', error);
          setError('Wystąpił błąd podczas inicjalizacji mapy. Spróbuj odświeżyć stronę.');
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Wystąpił błąd podczas inicjalizacji mapy. Spróbuj odświeżyć stronę.');
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update local state when map data changes
  useEffect(() => {
    setIsLoading(mapData.isLoading);
    setError(mapData.error);
    setStats(mapData.stats);
  }, [mapData.isLoading, mapData.error, mapData.stats]);

  return { mapRef, isLoading, error, stats };
}
