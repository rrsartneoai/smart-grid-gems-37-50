
import React from 'react';

export const AirQualityLegend = () => {
  return (
    <div className="mt-4 space-y-2">
      <div className="text-sm text-muted-foreground">
        Kliknij w znacznik na mapie, aby zobaczyć szczegółowe informacje o jakości powietrza.
        Kolor znacznika odpowiada jakości powietrza w danym miejscu.
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#34D399] mr-1"></span>
          Bardzo dobra (0-50)
        </span>
        <span className="inline-flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#FFFF00] mr-1"></span>
          Umiarkowana (50-100)
        </span>
        <span className="inline-flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#F59E0B] mr-1"></span>
          Niezdrowa dla wrażliwych osób (100-150)
        </span>
        <span className="inline-flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#EF4444] mr-1"></span>
          Niezdrowa (150-200)
        </span>
        <span className="inline-flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#800080] mr-1"></span>
          Bardzo niezdrowa (200-300)
        </span>
        <span className="inline-flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#7F1D1D] mr-1"></span>
          Niebezpieczna (300-500)
        </span>
      </div>
    </div>
  );
};
