
import { Input } from "@/components/ui/input";
import { AlertThreshold } from "./hooks/useAlertThresholds";

interface AlertThresholdItemProps {
  threshold: AlertThreshold;
  onChange: (parameter: string, value: number) => void;
}

export const AlertThresholdItem = ({ threshold, onChange }: AlertThresholdItemProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      onChange(threshold.parameter, newValue);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="w-24">{threshold.parameter}</span>
      <Input
        type="number"
        value={threshold.threshold}
        onChange={handleInputChange}
        className="w-32"
        min={0}
        aria-label={`Próg dla ${threshold.parameter}`}
      />
    </div>
  );
};
