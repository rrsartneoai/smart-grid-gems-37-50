
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AirlyMap } from "./AirlyMap";
import { AirQualitySpaces } from "./AirQualitySpaces";

export const PomeranianAirQuality = () => {
  return (
    <div className="space-y-6">
      <AirlyMap />
      
      {/* Airly.org Map Embed */}
      <Card className="dark:bg-[#1A1F2C] font-['Montserrat'] shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Mapa jakości powietrza - Trójmiasto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] rounded-lg overflow-hidden">
            <iframe 
              src="https://airly.org/map/pl/#54.3520,18.6466,11" 
              className="w-full h-full border-0" 
              title="Mapa jakości powietrza"
              aria-label="Interaktywna mapa jakości powietrza Airly dla Trójmiasta"
            />
          </div>
        </CardContent>
      </Card>
      
      <AirQualitySpaces />
    </div>
  );
};
