
import { CityData } from "./SensorsData";

interface CityDataDetailsProps {
  cityData: CityData;
}

export const CityDataDetails = ({ cityData }: CityDataDetailsProps) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Dane dla miasta {cityData.name}</h3>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground">
          Poniżej znajdują się szczegółowe informacje o jakości powietrza i warunkach środowiskowych w mieście {cityData.name}. 
          Wszystkie pomiary są aktualizowane w czasie rzeczywistym, zapewniając dokładny obraz stanu środowiska.
        </p>
        <div className="mt-4 grid gap-2">
          {cityData.sensors.map((sensor, index) => (
            <div key={index} className="p-4 rounded-lg bg-background/50 border">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{sensor.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold">{sensor.value}</span>
                  <span className="text-sm text-muted-foreground">{sensor.unit}</span>
                </div>
                <p className="text-sm text-muted-foreground">{sensor.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
