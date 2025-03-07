
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAlertThresholds } from "./hooks/useAlertThresholds";
import { AlertThresholdItem } from "./AlertThresholdItem";

export const AlertsConfig = () => {
  const { toast } = useToast();
  const { thresholds, updateThreshold, saveThresholds: saveToBackend } = useAlertThresholds();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveToBackend();
      toast({
        title: "Zapisano progi alertów",
        description: "Nowe wartości zostały zapisane pomyślnie."
      });
    } catch (error) {
      toast({
        title: "Błąd zapisywania",
        description: "Nie udało się zapisać progów alertów.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Konfiguracja Alertów</h3>
      <div className="space-y-4">
        {thresholds.map((threshold) => (
          <AlertThresholdItem
            key={threshold.parameter}
            threshold={threshold}
            onChange={updateThreshold}
          />
        ))}
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
        >
          {isSaving ? "Zapisywanie..." : "Zapisz"}
        </Button>
      </div>
    </Card>
  );
};
