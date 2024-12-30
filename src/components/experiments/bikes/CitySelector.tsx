import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CitySelectorProps {
  cities: string[];
  selectedCity: string;
  onCitySelect: (city: string) => void;
}

export const CitySelector = ({ cities, selectedCity, onCitySelect }: CitySelectorProps) => {
  return (
    <div className="w-full max-w-xs mb-4">
      <Select value={selectedCity} onValueChange={onCitySelect}>
        <SelectTrigger>
          <SelectValue placeholder="Wybierz miasto" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city} value={city.toLowerCase()}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};