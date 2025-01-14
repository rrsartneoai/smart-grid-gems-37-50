import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { companiesData } from "@/data/companies";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useCompanyStore } from "@/components/CompanySidebar";

export function CompanyActions() {
  const [isTestListOpen, setIsTestListOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { setSelectedCompanyId } = useCompanyStore();

  const handleAddCompany = () => {
    if (!newCompanyName.trim()) {
      toast({
        title: "Błąd",
        description: "Nazwa firmy nie może być pusta",
        variant: "destructive",
      });
      return;
    }

    const newCompany = {
      id: (companiesData.length + 1).toString(),
      name: newCompanyName,
      stats: [
        {
          title: "Ladunek",
          value: "12,500",
          unit: "MW",
          icon: companiesData[0].stats[0].icon,
          description: "↗️ +5.2% od ostatniego dnia",
          details: [
            { label: "Szczyt dzienny", value: "13,000 MW" },
            { label: "Minimum", value: "11,000 MW" },
            { label: "Średnia", value: "12,000 MW" },
          ],
        },
        {
          title: "Obciążenie netto",
          value: "11,800",
          unit: "MW",
          icon: companiesData[0].stats[1].icon,
          description: "↘️ -0.8% od ostatniej godziny",
          details: [
            { label: "Szczyt", value: "12,500 MW" },
            { label: "Minimum dzienne", value: "11,000 MW" },
            { label: "Prognoza", value: "11,500 MW" },
          ],
        },
        {
          title: "Cena",
          value: "29.75",
          unit: "/MWh",
          icon: companiesData[0].stats[2].icon,
          description: "↗️ +0.9% od ostatniego odczytu",
          details: [
            { label: "Maksymalna", value: "31.00 /MWh" },
            { label: "Minimalna", value: "28.50 /MWh" },
            { label: "Średnia dzienna", value: "29.25 /MWh" },
          ],
        },
        {
          title: "Główne źródło",
          value: "Energia odnawialna",
          icon: companiesData[0].stats[3].icon,
          description: "70% udziału w miksie",
          details: [
            { label: "Wydajność", value: "88%" },
            { label: "Emisja CO2", value: "150 g/kWh" },
            { label: "Moc nominalna", value: "15,000 MW" },
          ],
        },
        {
          title: "Częstotliwość sieci",
          value: "50.01",
          unit: "Hz",
          icon: companiesData[0].stats[4].icon,
          description: "Stabilna częstotliwość w normie",
          details: [
            { label: "Min", value: "49.97 Hz" },
            { label: "Max", value: "50.03 Hz" },
            { label: "Średnia", value: "50.00 Hz" },
          ],
        },
        {
          title: "Napięcie fazowe",
          value: "230.2",
          unit: "V",
          icon: companiesData[0].stats[5].icon,
          description: "Optymalne napięcie w sieci",
          details: [
            { label: "Min", value: "228.5 V" },
            { label: "Max", value: "231.5 V" },
            { label: "Średnia", value: "230.0 V" },
          ],
        },
        {
          title: "Jakość sygnału",
          value: "97.5",
          unit: "%",
          icon: companiesData[0].stats[6].icon,
          description: "Wysoka jakość transmisji danych",
          details: [
            { label: "Utracone pakiety", value: "0.03%" },
            { label: "Opóźnienie", value: "18ms" },
            { label: "Stabilność", value: "99.8%" },
          ],
        },
        {
          title: "Czas odpowiedzi",
          value: "15",
          unit: "ms",
          icon: companiesData[0].stats[7].icon,
          description: "Szybka komunikacja z urządzeniami",
          details: [
            { label: "Min", value: "10 ms" },
            { label: "Max", value: "22 ms" },
            { label: "Średnia", value: "16 ms" },
          ],
        },
      ],
      energyData: [
        { name: "00:00", consumption: 350, production: 320, efficiency: 91 },
        { name: "12:00", consumption: 650, production: 600, efficiency: 92 },
        { name: "23:59", consumption: 350, production: 320, efficiency: 91 },
      ],
    };

    companiesData.push(newCompany);

    toast({
      title: "Sukces",
      description: `Firma "${newCompanyName}" została dodana`,
    });

    setNewCompanyName("");
    setIsDialogOpen(false);
  };

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setIsTestListOpen(false);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsTestListOpen(!isTestListOpen)}
            className="w-full sm:w-auto"
          >
            Testowe
            {isTestListOpen ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
          <AnimatePresence>
            {isTestListOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 mt-2 w-64 rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <ul className="py-2 px-4 space-y-2">
                  {companiesData.slice(0, 5).map((company) => (
                    <li
                      key={company.id}
                      className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => handleCompanySelect(company.id)}
                    >
                      {company.name}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Dodaj firmę
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nową firmę</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  placeholder="Nazwa firmy"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                />
              </div>
              <Button onClick={handleAddCompany} className="w-full">
                Dodaj
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}