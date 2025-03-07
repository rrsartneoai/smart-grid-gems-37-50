
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AirlyMap } from "./AirlyMap";
import { AirQualitySpaces } from "./AirQualitySpaces";
import { Info, Plus, Minus, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema for sensor configuration
const sensorFormSchema = z.object({
  name: z.string().min(1, { message: "Nazwa jest wymagana" }),
  connectionType: z.enum(["webhook", "api", "mqtt", "url"]),
  connectionValue: z.string().min(1, { message: "Wartość połączenia jest wymagana" }),
});

type SensorFormValues = z.infer<typeof sensorFormSchema>;

export const PomeranianAirQuality = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  
  const form = useForm<SensorFormValues>({
    resolver: zodResolver(sensorFormSchema),
    defaultValues: {
      name: "",
      connectionType: "webhook",
      connectionValue: "",
    },
  });

  const onSubmit = (data: SensorFormValues) => {
    console.log("Sensor data:", data);
    // Here you would add the sensor with the provided data
    setIsAddDialogOpen(false);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-4 border border-primary/20">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">Dane o jakości powietrza</h3>
            <p className="text-sm text-muted-foreground">
              Poniżej prezentujemy dane o jakości powietrza w Trójmieście pochodzące z wielu źródeł:
              stacji pomiarowych Airly, stacji Głównego Inspektoratu Ochrony Środowiska (GIOŚ) oraz
              World Air Quality Index Project (AQICN). Dane są aktualizowane w czasie rzeczywistym.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Dodaj czujnik
        </Button>
        <Button onClick={() => setIsRemoveDialogOpen(true)} variant="outline" className="flex items-center gap-2">
          <Minus className="w-4 h-4" />
          Usuń czujnik
        </Button>
        <Button onClick={() => setIsSearchDialogOpen(true)} variant="secondary" className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          Wyszukaj czujnik
        </Button>
      </div>
      
      <AirlyMap />
      
      {/* AQICN Map Embed - Centered on Gdańsk Wrzeszcz */}
      <Card className="dark:bg-[#1A1F2C] font-['Montserrat'] shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Mapa jakości powietrza - Gdańsk Wrzeszcz (AQICN)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] rounded-lg overflow-hidden">
            <iframe 
              src="https://aqicn.org/city/poland/gdansk/gdansk-wrzeszcz/pl/#@54.380277777778,18.620277777778,14z" 
              className="w-full h-full border-0" 
              title="Mapa jakości powietrza AQICN - Gdańsk Wrzeszcz"
              aria-label="Interaktywna mapa jakości powietrza AQICN dla Gdańska Wrzeszcz"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Airly Map Embed */}
      <Card className="dark:bg-[#1A1F2C] font-['Montserrat'] shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Mapa jakości powietrza - Trójmiasto (Airly)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] rounded-lg overflow-hidden">
            <iframe 
              src="https://airly.org/map/pl/#54.3520,18.6466,11" 
              className="w-full h-full border-0" 
              title="Mapa jakości powietrza Airly"
              aria-label="Interaktywna mapa jakości powietrza Airly dla Trójmiasta"
            />
          </div>
        </CardContent>
      </Card>
      
      <AirQualitySpaces />

      {/* Add Sensor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Dodaj nowy czujnik</DialogTitle>
            <DialogDescription>
              Wprowadź dane potrzebne do połączenia z czujnikiem jakości powietrza.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa czujnika</FormLabel>
                    <FormControl>
                      <Input placeholder="Mój czujnik" {...field} />
                    </FormControl>
                    <FormDescription>
                      Podaj nazwę, która pomoże Ci zidentyfikować ten czujnik.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="connectionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ połączenia</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="webhook">Webhook</option>
                        <option value="api">Klucz API</option>
                        <option value="mqtt">MQTT</option>
                        <option value="url">URL with token</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Wybierz metodę, za pomocą której będziesz łączyć się z czujnikiem.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="connectionValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("connectionType") === "webhook" ? "Webhook URL" : 
                       form.watch("connectionType") === "api" ? "Klucz API" : 
                       form.watch("connectionType") === "mqtt" ? "MQTT Endpoint" : 
                       "URL z tokenem"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={
                          form.watch("connectionType") === "webhook" ? "https://example.com/webhook" : 
                          form.watch("connectionType") === "api" ? "api_key_123456" : 
                          form.watch("connectionType") === "mqtt" ? "mqtt://broker:1883" : 
                          "https://example.com/api?token=123456"
                        } 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Anuluj
                </Button>
                <Button type="submit">Dodaj czujnik</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Remove Sensor Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Usuń czujnik</DialogTitle>
            <DialogDescription>
              Wybierz czujnik, który chcesz usunąć z systemu.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Obecnie brak aktywnych czujników niestandardowych do usunięcia.
            </p>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
                Zamknij
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search Sensor Dialog */}
      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Wyszukaj czujnik</DialogTitle>
            <DialogDescription>
              Wprowadź parametry wyszukiwania czujnika.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <FormLabel>Lokalizacja</FormLabel>
              <Input placeholder="np. Gdańsk, Sopot, Gdynia" />
            </div>
            
            <div className="space-y-2">
              <FormLabel>Promień wyszukiwania (km)</FormLabel>
              <Input type="number" defaultValue="5" min="1" max="50" />
            </div>
            
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSearchDialogOpen(false)}>
                Anuluj
              </Button>
              <Button>Wyszukaj</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
