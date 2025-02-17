
import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const metrics = [
  {
    title: "PM2.5",
    value: "15.2",
    unit: "µg/m³",
    status: "Good",
    change: "+7.2",
    period: "od ostatniego dnia"
  },
  {
    title: "PM10",
    value: "25.4",
    unit: "µg/m³",
    status: "Good",
    change: "-1.5",
    period: "od ostatniej godziny"
  },
  {
    title: "NO₂",
    value: "30.5",
    unit: "µg/m³",
    status: "Good",
    change: "+1.2",
    period: "od ostatniego odczytu"
  },
  {
    title: "Dominujące zanieczyszczenie",
    value: "PM10",
    unit: "",
    status: "Good",
    subtext: "60% udziału w pomiarze"
  },
  {
    title: "Wilgotność",
    value: "50.02",
    unit: "%",
    status: "Good",
    subtext: "Optymalna wilgotność powietrza"
  },
  {
    title: "Temperatura",
    value: "21.5",
    unit: "°C",
    status: "Good",
    subtext: "Optymalna temperatura powietrza"
  },
  {
    title: "Jakość sygnału czujnika",
    value: "98.5",
    unit: "%",
    status: "Good",
    subtext: "Wysoka jakość odczytu"
  },
  {
    title: "Czas aktualizacji",
    value: "12",
    unit: "min",
    status: "Good",
    subtext: "Ostatnia aktualizacja danych"
  }
];

export const AirQualitySpaces = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => (
        <Card key={i} className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </p>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                {metric.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {metric.unit}
                </span>
              </h2>
              {metric.status === "Good" && (
                <span className="text-sm font-medium text-green-500">
                  {metric.status}
                </span>
              )}
            </div>
            {metric.change ? (
              <p className="text-xs text-muted-foreground flex items-center">
                {parseFloat(metric.change) > 0 ? (
                  <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                )}
                {metric.change}% {metric.period}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {metric.subtext}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
