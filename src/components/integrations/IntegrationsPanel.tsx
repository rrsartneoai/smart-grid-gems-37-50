import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import {
  Home,
  Zap,
  Globe,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const IntegrationsPanel = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleZapierIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl) {
      toast({
        title: "Błąd",
        description: "Wprowadź URL webhooka Zapier",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          source: window.location.origin,
        }),
      });

      toast({
        title: "Sukces",
        description: "Zapytanie zostało wysłane do Zapier",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się połączyć z Zapier",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const integrations = [
    {
      title: "Smart Home",
      icon: Home,
      description: "Integracja z systemami inteligentnego domu",
      status: "connected",
    },
    {
      title: "Zarządzanie Energią",
      icon: Zap,
      description: "System zarządzania energią",
      status: "warning",
    },
    {
      title: "Zapier",
      icon: Globe,
      description: "Automatyzacja z innymi platformami",
      status: "disconnected",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Integracje</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <AlertCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zarządzaj integracjami z zewnętrznymi systemami</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <integration.icon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">{integration.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
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

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Konfiguracja Zapier</h3>
        <form onSubmit={handleZapierIntegration} className="space-y-4">
          <div>
            <Input
              placeholder="Wprowadź URL webhooka Zapier"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Połącz z Zapier
          </Button>
        </form>
      </Card>
    </div>
  );
};