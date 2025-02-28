
import React from "react";

const AirlyIframeMap: React.FC = () => {
  return (
    <div className="w-full bg-background rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">Mapa Airly</h2>
        <p className="text-muted-foreground">Aktualna jakość powietrza na mapie</p>
      </div>
      <div className="w-full h-[600px] relative">
        <iframe 
          src="https://airly.org/map/pl/#54.3520,18.6466,11" 
          className="w-full h-full border-0" 
          title="Mapa jakości powietrza"
          allow="geolocation"
        />
      </div>
    </div>
  );
};

export default AirlyIframeMap;
