import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Home, Zap, Globe, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type IntegrationType = "smartHome" | "energyManagement" | "zapier";

interface IntegrationConfig {
  webhook?: string;
  apiKey?: string;
  endpoint?: string;
}

export const IntegrationsPanel = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationType | null>(null);
  const [config, setConfig] = useState<IntegrationConfig>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t("connected"),
        description: `${t(selectedIntegration || "")} ${t("configureWebhook")}`,
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const integrations = [
    {
      type: "smartHome" as const,
      icon: Home,
      status: "connected",
    },
    {
      type: "energyManagement" as const,
      icon: Zap,
      status: "warning",
    },
    {
      type: "zapier" as const,
      icon: Globe,
      status: "disconnected",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {integrations.map((integration) => (
          <motion.div
            key={integration.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSelectedIntegration(integration.type)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <integration.icon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">{t(integration.type)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("integrationStatus")}: {t(integration.status)}
                    </p>
                  </div>
                </div>
                {integration.status === "connected" && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {integration.status === "warning" && (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                {integration.status === "disconnected" && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedIntegration && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("configure")} {t(selectedIntegration)}
          </h3>
          <form onSubmit={handleConfigSubmit} className="space-y-4">
            <div>
              <Input
                placeholder={t("webhookUrl")}
                value={config.webhook || ""}
                onChange={(e) => setConfig({ ...config, webhook: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("save")}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setSelectedIntegration(null)}
              >
                {t("cancel")}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};