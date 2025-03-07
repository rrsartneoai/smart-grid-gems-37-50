
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';

interface ComparisonSelectorsProps {
  city1: string;
  city2: string;
  parameter: string;
  cities: string[];
  parameters: string[];
  onCity1Change: (value: string) => void;
  onCity2Change: (value: string) => void;
  onParameterChange: (value: string) => void;
}

export const ComparisonSelectors = ({
  city1,
  city2,
  parameter,
  cities,
  parameters,
  onCity1Change,
  onCity2Change,
  onParameterChange
}: ComparisonSelectorsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-4">
      <Select value={city1} onValueChange={onCity1Change}>
        <SelectTrigger>
          <SelectValue placeholder={t('selectCity') + " 1"} />
        </SelectTrigger>
        <SelectContent>
          {cities.map(city => (
            <SelectItem key={city} value={city}>
              {city.charAt(0).toUpperCase() + city.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={city2} onValueChange={onCity2Change}>
        <SelectTrigger>
          <SelectValue placeholder={t('selectCity') + " 2"} />
        </SelectTrigger>
        <SelectContent>
          {cities.map(city => (
            <SelectItem key={city} value={city}>
              {city.charAt(0).toUpperCase() + city.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={parameter} onValueChange={onParameterChange}>
        <SelectTrigger>
          <SelectValue placeholder={t('selectParameter')} />
        </SelectTrigger>
        <SelectContent>
          {parameters.map(param => (
            <SelectItem key={param} value={param}>
              {param}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
