
import { useState } from "react";
import { InfoCard } from "./InfoCard";
import { ActionButtons } from "./ActionButtons";
import { AirlyMap } from "./AirlyMap";
import { AqicnMapEmbed } from "./maps/AqicnMapEmbed";
import { AirlyMapEmbed } from "./maps/AirlyMapEmbed";
import { AirQualitySpaces } from "./AirQualitySpaces";
import { AddSensorDialog, SensorFormValues } from "./dialogs/AddSensorDialog";
import { RemoveSensorDialog } from "./dialogs/RemoveSensorDialog";
import { SearchSensorDialog } from "./dialogs/SearchSensorDialog";

export const PomeranianAirQuality = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  
  const handleAddSensor = (data: SensorFormValues) => {
    console.log("Sensor data:", data);
    // Here you would add the sensor with the provided data
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <InfoCard />
      
      <ActionButtons 
        onAddClick={() => setIsAddDialogOpen(true)}
        onRemoveClick={() => setIsRemoveDialogOpen(true)}
        onSearchClick={() => setIsSearchDialogOpen(true)}
      />
      
      <AirlyMap />
      <AqicnMapEmbed />
      <AirlyMapEmbed />
      <AirQualitySpaces />

      {/* Dialogs */}
      <AddSensorDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddSensor}
      />
      
      <RemoveSensorDialog 
        isOpen={isRemoveDialogOpen} 
        onOpenChange={setIsRemoveDialogOpen}
      />
      
      <SearchSensorDialog 
        isOpen={isSearchDialogOpen} 
        onOpenChange={setIsSearchDialogOpen}
      />
    </div>
  );
};
