
import React from 'react';

export const AirQualityLegend = () => {
  return (
    <div className="mt-4 space-y-2">
      <div className="text-sm text-muted-foreground">
        Kliknij w znacznik na mapie, aby zobaczyć szczegółowe informacje o jakości powietrza.
        Kolor znacznika odpowiada jakości powietrza w danym miejscu.
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#34D399] mr-1"></span>
          Bardzo dobra
        </span>
        <span className="inline-flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#FBBF24] mr-1"></span>
          Dobra
        </span>
        <span className="inline-flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#F59E0B] mr-1"></span>
          Umiarkowana
        </span>
        <span className="inline-flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#EF4444] mr-1"></span>
          Zła
        </span>
      </div>
    </div>
  );
};

