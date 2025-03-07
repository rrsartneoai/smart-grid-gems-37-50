
import { useState } from 'react';

export interface AlertThreshold {
  parameter: string;
  threshold: number;
}

export const useAlertThresholds = () => {
  const [thresholds, setThresholds] = useState<AlertThreshold[]>([
    { parameter: 'PM2.5', threshold: 25 },
    { parameter: 'PM10', threshold: 50 },
    { parameter: 'CO₂', threshold: 1000 }
  ]);

  const updateThreshold = (parameter: string, value: number) => {
    setThresholds(prev =>
      prev.map(t =>
        t.parameter === parameter ? { ...t, threshold: value } : t
      )
    );
  };

  const saveThresholds = async () => {
    // Simulate API call with a promise
    return new Promise<void>((resolve) => {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Save to localStorage for demo purposes
        localStorage.setItem('alertThresholds', JSON.stringify(thresholds));
        resolve();
      }, 500);
    });
  };

  return {
    thresholds,
    updateThreshold,
    saveThresholds
  };
};
