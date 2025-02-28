
import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchInstallations } from "./airlyService";
import { AirQualityLegend } from "./legend/AirQualityLegend";
import { ErrorOverlay } from "./error/ErrorOverlay";
import { LoadingOverlay } from "./loading/LoadingOverlay";
import { AirlyInstallation } from "./types";
import { createAirQualityMarker } from "./markers/AirQualityMarker";
import { createAirQualityPopup } from "./AirQualityPopup";
import { defaultMapOptions, mapCenter } from "./config/mapConfig";

function MapUpdater({ installations }: { installations: AirlyInstallation[] }) {
  const map = useMap();

  useEffect(() => {
    const markers = L.layerGroup();

    installations.forEach((installation) => {
      const { latitude, longitude } = installation.location;
      const marker = createAirQualityMarker(installation);
      
      marker.addTo(markers);
      marker.bindPopup(() => createAirQualityPopup(installation));
    });

    markers.addTo(map);

    return () => {
      map.removeLayer(markers);
    };
  }, [map, installations]);

  return null;
}

export const AirlyMap: React.FC = () => {
  const [installations, setInstallations] = useState<AirlyInstallation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInstallations();
      setInstallations(data);
    } catch (err) {
      setError("Nie udało się pobrać danych z serwisu Airly. Spróbuj odświeżyć stronę.");
      console.error("Error fetching installations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="w-full bg-background rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">Mapa stacji pomiarowych Airly</h2>
        <p className="text-muted-foreground">Aktualne pomiary jakości powietrza z czujników Airly</p>
      </div>
      <div className="w-full h-[600px] relative">
        <MapContainer
          center={mapCenter}
          zoom={defaultMapOptions.zoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {installations.length > 0 && <MapUpdater installations={installations} />}
          <AirQualityLegend />
        </MapContainer>

        {loading && <LoadingOverlay />}
        {error && <ErrorOverlay message={error} onRetry={loadData} />}
      </div>
    </div>
  );
};
