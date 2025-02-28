
import React from "react";
import { AirlyMap } from "./AirlyMap";
import AirlyIframeMap from "./AirlyIframeMap";
import { AirQualitySpaces } from "./AirQualitySpaces";

export const PomeranianAirQuality: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Jakość powietrza w województwie pomorskim</h1>
        <p className="text-muted-foreground">
          Monitoruj aktualną jakość powietrza w różnych lokalizacjach województwa pomorskiego. 
          Dane są aktualizowane co godzinę z czujników Airly.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <AirQualitySpaces />
        <AirlyMap />
        <AirlyIframeMap />
      </div>
    </div>
  );
};
