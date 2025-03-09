
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { sensorsData } from "./SensorsData";
import { CityTabs } from "./CityTabs";
import { SearchBar } from "./SearchBar";
import { ExportButtons } from "./ExportButtons";
import { StatusIndicators } from "./StatusIndicators";
import { SensorsGrid } from "./SensorsGrid";
import { AlertsConfig } from "./AlertsConfig";
import { DataComparison } from "./DataComparison";
import { AirQualityChart } from "../dashboard/AirQualityChart";
import { CityDataDetails } from "./CityDataDetails";
import { useSensorDataFetching } from "./hooks/useSensorDataFetching";

const SensorsPanel = () => {
  const [selectedCity, setSelectedCity] = useState<string>("gdansk");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  
  const cities = Object.keys(sensorsData).map(key => 
    key.charAt(0).toUpperCase() + key.slice(1)
  );

  const { currentCityData, getSensorData } = useSensorDataFetching(selectedCity);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city.toLowerCase());
  };

  // Filter sensors based on search query and enrich with real data
  const filteredSensors = currentCityData?.sensors.map(sensor => {
    const realData = getSensorData(sensor.name);
    if (realData) {
      return {
        ...sensor,
        value: realData.value,
        description: realData.description,
      };
    }
    return sensor;
  }).filter(sensor =>
    sensor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sensor.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4" id="sensors-panel">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold">Czujniki i jakość powietrza</h2>
          <StatusIndicators />
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-card p-4 rounded-lg shadow-sm">
          <div className="flex-1 min-w-[200px]">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('searchSensors')}
            />
          </div>
          <ExportButtons />
        </div>

        <div className="mb-6">
          <CityTabs
            cities={cities}
            selectedCity={selectedCity}
            onCitySelect={handleCitySelect}
          />
        </div>

        {currentCityData && (
          <>
            <SensorsGrid sensors={filteredSensors} />

            <div className="mt-8 space-y-8">
              <AlertsConfig />
              <DataComparison />
              <AirQualityChart />
              <CityDataDetails cityData={currentCityData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SensorsPanel;
