
import { CityTabs } from "./CityTabs";
import { sensorsData } from "./SensorsData";
import "react-toastify/dist/ReactToastify.css";
import { SensorHeader } from "./SensorHeader";
import { SensorExportButtons } from "./SensorExportButtons";
import { SensorContent } from "./SensorContent";
import { useSensorData } from "@/hooks/useSensorData";

const SensorsPanel = () => {
  const {
    selectedCity,
    searchQuery,
    setSearchQuery,
    cities,
    currentCityData,
    handleCitySelect,
    getFilteredSensors
  } = useSensorData();

  const filteredSensors = getFilteredSensors();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4" id="sensors-panel">
      <div className="flex flex-col gap-4">
        <SensorHeader />

        <SensorExportButtons 
          sensorsPanelId="sensors-panel"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sensorsData={sensorsData}
        />

        <div className="mb-6">
          <CityTabs
            cities={cities}
            selectedCity={selectedCity}
            onCitySelect={handleCitySelect}
          />
        </div>

        <SensorContent 
          currentCityData={currentCityData} 
          filteredSensors={filteredSensors} 
        />
      </div>
    </div>
  );
};

export default SensorsPanel;
