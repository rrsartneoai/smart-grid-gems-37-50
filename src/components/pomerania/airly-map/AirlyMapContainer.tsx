
import React from 'react';
import { LoadingOverlay } from '../loading/LoadingOverlay';
import { ErrorOverlay } from '../error/ErrorOverlay';

interface AirlyMapContainerProps {
  mapRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  error: string | null;
  stats: {
    loaded: number;
    total: number;
  };
}

export const AirlyMapContainer: React.FC<AirlyMapContainerProps> = ({
  mapRef,
  isLoading,
  error,
  stats
}) => {
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
};
