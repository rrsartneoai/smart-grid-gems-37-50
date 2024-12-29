import { motion } from "framer-motion";
import { CompanySidebar } from "@/components/CompanySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';
import { IndexHeader } from "./components/IndexHeader";
import { SpacesTab } from "./components/SpacesTab";
import { InsightsTab } from "./components/InsightsTab";
import { StatusTab } from "./components/StatusTab";
import { SensorsTab } from "./components/SensorsTab";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="min-h-screen flex w-full flex-col lg:flex-row">
          <CompanySidebar />
          <main className="flex-1 p-4 lg:pl-[320px] transition-all duration-300">
            <IndexHeader />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6 mt-20 lg:mt-28"
            >
              <Tabs defaultValue="spaces" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-4">
                  <TabsTrigger value="spaces" className="min-w-[120px]">{t('spaces')}</TabsTrigger>
                  <TabsTrigger value="insights" className="min-w-[120px]">{t('analysis')}</TabsTrigger>
                  <TabsTrigger value="status" className="min-w-[120px]">{t('status')}</TabsTrigger>
                  <TabsTrigger value="sensors" className="min-w-[120px]">{t('sensors')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="spaces">
                  <SpacesTab />
                </TabsContent>

                <TabsContent value="insights">
                  <InsightsTab />
                </TabsContent>

                <TabsContent value="status">
                  <StatusTab />
                </TabsContent>

                <TabsContent value="sensors">
                  <SensorsTab />
                </TabsContent>
              </Tabs>
            </motion.div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;