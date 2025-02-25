import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { companies } from "@/data/companies";
import { CheckCircle2, Circle, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function IoTStatus() {
  const { t } = useTranslation();
  const company = companies[0];

  const getStatus = (value: string): {
    status: "online" | "offline" | "unknown";
    icon: React.ReactNode;
    color: string;
  } => {
    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
      return {
        status: "unknown",
        icon: <HelpCircle className="h-4 w-4 text-gray-500" />,
        color: "text-gray-500",
      };
    }

    if (numericValue > 50) {
      return {
        status: "online",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        color: "text-green-500",
      };
    } else {
      return {
        status: "offline",
        icon: <Circle className="h-4 w-4 text-red-500" />,
        color: "text-red-500",
      };
    }
  };

  return (
    <Card className="dark:bg-[#1A1F2C]">
      <CardHeader>
        <CardTitle>{t("IoT Device Status")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {company.stats.map((stat) => {
            const status = getStatus(stat.value);
            return (
              <div key={stat.title} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {stat.title}
                      </TooltipTrigger>
                      <TooltipContent>
                        {stat.description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className={`flex items-center gap-2 ${status.color}`}>
                  {status.icon}
                  {status.status}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
