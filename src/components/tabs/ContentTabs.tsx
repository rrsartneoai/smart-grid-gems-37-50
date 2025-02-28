
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpacesTabContent } from "./SpacesTabContent";
import { CompanyAnalysis } from "@/components/analysis/CompanyAnalysis";
import { IoTStatus } from "@/components/status/IoTStatus";
import SensorsPanel from "@/components/sensors/SensorsPanel";
import { IntegrationsPanel } from "@/components/integrations/IntegrationsPanel";
import { PomeranianAirQuality } from "@/components/pomerania/PomeranianAirQuality";
import { useTranslation } from 'react-i18next';

export const ContentTabs = () => {
  const { t } = useTranslation();
  
  return (
    <Tabs defaultValue="spaces" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto flex-wrap">
        <TabsTrigger value="spaces">{t('spaces')}</TabsTrigger>
        <TabsTrigger value="air-quality">Mapy jakości powietrza</TabsTrigger>
        <TabsTrigger value="insights">{t('analysis')}</TabsTrigger>
        <TabsTrigger value="status">{t('status')}</TabsTrigger>
        <TabsTrigger value="sensors">{t('sensors')}</TabsTrigger>
        <TabsTrigger value="integrations">{t('integrations')}</TabsTrigger>
      </TabsList>

      <TabsContent value="spaces" className="space-y-6">
        <SpacesTabContent />
      </TabsContent>

      <TabsContent value="air-quality">
        <PomeranianAirQuality />
      </TabsContent>

      <TabsContent value="insights">
        <CompanyAnalysis />
      </TabsContent>

      <TabsContent value="status">
        <IoTStatus />
      </TabsContent>

      <TabsContent value="sensors">
        <SensorsPanel />
      </TabsContent>

      <TabsContent value="integrations">
        <IntegrationsPanel />
      </TabsContent>
    </Tabs>
  );
};
