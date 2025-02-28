
import { Clock, Battery, Signal } from "lucide-react";
import { useTranslation } from "react-i18next";

export const SensorHeader = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl sm:text-2xl font-bold">Czujniki i jakość powietrza</h2>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>{t('lastSync')}: 1h</span>
        <Battery className="w-4 h-4 ml-4" />
        <span>100% est. battery</span>
        <Signal className="w-4 h-4 ml-4" />
        <span>-71 dBm</span>
      </div>
    </div>
  );
};
