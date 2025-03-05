
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AirQualityLegend } from "../legend/AirQualityLegend";
import { AirQualityDetailDialog } from "../AirQualityDetailDialog";
import { useAirlyMap } from "./useAirlyMap";
import { AirlyMapContainer } from "./AirlyMapContainer";
import { MapStyles } from "./MapStyles";

export function AirlyMap() {
  const {
    mapRef,
    isLoading,
    error,
    stats,
    selectedStation,
    isDetailDialogOpen,
    handleCloseDetailDialog
  } = useAirlyMap();

  return (
    <Card className="dark:bg-[#1A1F2C] font-['Montserrat'] shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Mapa jakości powietrza - Trójmiasto</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Map container */}
        <AirlyMapContainer 
          mapRef={mapRef}
          isLoading={isLoading}
          error={error}
          stats={stats}
        />

        <AirQualityLegend />
        
        {/* Detail dialog */}
        <AirQualityDetailDialog 
          isOpen={isDetailDialogOpen} 
          onClose={handleCloseDetailDialog} 
          data={selectedStation} 
        />

        {/* Map styles */}
        <MapStyles />
      </CardContent>
    </Card>
  );
}
