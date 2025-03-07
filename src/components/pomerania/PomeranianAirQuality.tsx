
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AirlyMap } from "./AirlyMap";
import { AirQualitySpaces } from "./AirQualitySpaces";
import { Info } from "lucide-react";

export const PomeranianAirQuality = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-4 border border-primary/20">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">Dane o jakości powietrza</h3>
            <p className="text-sm text-muted-foreground">
              Poniżej prezentujemy dane o jakości powietrza w Trójmieście pochodzące z wielu źródeł:
              stacji pomiarowych Airly, stacji Głównego Inspektoratu Ochrony Środowiska (GIOŚ) oraz
              World Air Quality Index Project (AQICN). Dane są aktualizowane w czasie rzeczywistym.
            </p>
          </div>
        </div>
      </div>
      
      <AirlyMap />
      
      {/* AQICN Map Embed - Centered on Gdańsk Wrzeszcz */}
      <Card className="dark:bg-[#1A1F2C] font-['Montserrat'] shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Mapa jakości powietrza - Gdańsk Wrzeszcz (AQICN)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] rounded-lg overflow-hidden">
            <iframe 
              src="https://aqicn.org/city/poland/gdansk/gdansk-wrzeszcz/pl/#@54.380277777778,18.620277777778,14z" 
              className="w-full h-full border-0" 
              title="Mapa jakości powietrza AQICN - Gdańsk Wrzeszcz"
              aria-label="Interaktywna mapa jakości powietrza AQICN dla Gdańska Wrzeszcz"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Airly Map Embed */}
      <Card className="dark:bg-[#1A1F2C] font-['Montserrat'] shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Mapa jakości powietrza - Trójmiasto (Airly)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] rounded-lg overflow-hidden">
            <iframe 
              src="https://airly.org/map/pl/#54.3520,18.6466,11" 
              className="w-full h-full border-0" 
              title="Mapa jakości powietrza Airly"
              aria-label="Interaktywna mapa jakości powietrza Airly dla Trójmiasta"
            />
          </div>
        </CardContent>
      </Card>
      
      <AirQualitySpaces />
    </div>
  );
};
