
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { ComparisonChart } from './ComparisonChart';
import { HistoricalChart } from './HistoricalChart';
import { ComparisonSelectors } from './ComparisonSelectors';
import { useComparisonData } from './hooks/useComparisonData';

export const DataComparison = () => {
  const [city1, setCity1] = useState('gdansk');
  const [city2, setCity2] = useState('sopot');
  const [parameter, setParameter] = useState('PM2.5');
  const { t } = useTranslation();
  
  const { cities, parameters, city1Data, city2Data } = useComparisonData(city1, city2, parameter);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t('Porównanie danych')}</h3>
      <div className="grid gap-4 mb-6">
        <ComparisonSelectors 
          city1={city1}
          city2={city2}
          parameter={parameter}
          cities={cities}
          parameters={parameters}
          onCity1Change={setCity1}
          onCity2Change={setCity2}
          onParameterChange={setParameter}
        />

        <div className="grid gap-4">
          <ComparisonChart
            data1={city1Data}
            data2={city2Data}
            title={`${parameter} - ${t('comparison')}`}
            city1={city1}
            city2={city2}
            unit="µg/m³"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <HistoricalChart
              data={city1Data}
              title={`${parameter} - ${city1}`}
              unit="µg/m³"
            />
            <HistoricalChart
              data={city2Data}
              title={`${parameter} - ${city2}`}
              unit="µg/m³"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
