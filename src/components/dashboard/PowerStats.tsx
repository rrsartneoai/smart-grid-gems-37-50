import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Flame, PackageCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanyStore } from "@/components/CompanySidebar";
import { companies } from "@/data/companies";

interface PowerStatsProps {
  className?: string;
}

export function PowerStats({ className }: PowerStatsProps) {
  const { selectedCompanyId } = useCompanyStore();
  const [isLoading, setIsLoading] = useState(true);
  const [energyStats, setEnergyStats] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const selectedCompany = companies.find(company => company.id === selectedCompanyId);
      if (selectedCompany) {
        setEnergyStats(selectedCompany.stats);
      }
      setIsLoading(false);
    }, 500);
  }, [selectedCompanyId]);

  return (
    <>
      {isLoading ? (
        <>
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="col-span-1 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle><Skeleton className="h-6 w-24 mb-2" /></CardTitle>
                <CardDescription><Skeleton className="h-4 w-40" /></CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        energyStats?.map((stat, index) => (
          <Card key={index} className="col-span-1 md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon && <stat.icon className="h-4 w-4 text-gray-500" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value} {stat.unit}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
}
