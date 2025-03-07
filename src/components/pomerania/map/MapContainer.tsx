
import React from 'react';
import { LoadingOverlay } from "../loading/LoadingOverlay";
import { ErrorOverlay } from "../error/ErrorOverlay";

interface MapContainerProps {
  mapRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  error: string | null;
  stats: { total: number; loaded: number };
}

export function MapContainer({ mapRef, isLoading, error, stats }: MapContainerProps) {
  return (
    <div 
      className="relative w-full h-[600px] rounded-lg overflow-hidden"
      ref={mapRef}
      role="application"
      aria-label="Mapa jakości powietrza w Trójmieście"
    >
      {isLoading && <LoadingOverlay loaded={stats.loaded} total={stats.total} />}
      {error && <ErrorOverlay message={error} />}
    </div>
  );
}
