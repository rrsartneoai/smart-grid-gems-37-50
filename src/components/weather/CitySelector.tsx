import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface CitySelectorProps {
  cities: string[];
  selectedCity: string;
  onCitySelect: (cityId: string) => void;
}

export const CitySelector = ({ cities, selectedCity, onCitySelect }: CitySelectorProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-xs mb-4">
      <Select value={selectedCity} onValueChange={onCitySelect}>
        <SelectTrigger>
          <SelectValue placeholder={t("selectCity")} />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.toLowerCase()} value={city.toLowerCase()}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};