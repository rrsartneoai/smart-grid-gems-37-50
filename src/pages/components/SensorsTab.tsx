import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export function SensorsTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Czujniki</h3>
          <p className="text-sm text-muted-foreground">
            Dane z czujników będą dostępne wkrótce.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}