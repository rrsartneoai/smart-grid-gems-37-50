
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp, MinusCircle, RotateCcw } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

export function CompanyActions() {
  const [isTestListOpen, setIsTestListOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { setSelectedCompanyId } = useCompanyStore();
  const [archivedProjects, setArchivedProjects] = useState<typeof companiesData>([]);

  const handleAddProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Błąd",
        description: "Nazwa projektu nie może być pusta",
        variant: "destructive",
      });
      return;
    }

    const newProject = {
      id: (companiesData.length + 1).toString(),
      name: newProjectName,
      stats: [
        {
          title: "PM2.5",
          value: (Math.random() * 25).toFixed(1),
          unit: "µg/m³",
          icon: companiesData[0].stats[0].icon,
          description: "↗️ +2.1% od ostatniego pomiaru",
          details: [
            { label: "Norma WHO", value: "10 µg/m³" },
            { label: "Norma EU", value: "25 µg/m³" },
            { label: "Średnia 24h", value: "15.2 µg/m³" },
          ],
        },
        {
          title: "PM10",
          value: (Math.random() * 40).toFixed(1),
          unit: "µg/m³",
          icon: companiesData[0].stats[1].icon,
          description: "↘️ -1.2% od ostatniej godziny",
          details: [
            { label: "Norma WHO", value: "20 µg/m³" },
            { label: "Norma EU", value: "50 µg/m³" },
            { label: "Średnia 24h", value: "28.5 µg/m³" },
          ],
        },
        {
          title: "O₃ (Ozon)",
          value: (Math.random() * 100).toFixed(1),
          unit: "µg/m³",
          icon: companiesData[0].stats[2].icon,
          description: "↗️ +1.5% od ostatniego odczytu",
          details: [
            { label: "Norma WHO", value: "100 µg/m³" },
            { label: "Norma EU", value: "120 µg/m³" },
            { label: "Średnia 8h", value: "85.3 µg/m³" },
          ],
        },
        {
          title: "NO₂",
          value: (Math.random() * 40).toFixed(1),
          unit: "µg/m³",
          icon: companiesData[0].stats[3].icon,
          description: "↘️ -0.8% od ostatniej godziny",
          details: [
            { label: "Norma WHO", value: "40 µg/m³" },
            { label: "Norma EU", value: "40 µg/m³" },
            { label: "Średnia roczna", value: "32.1 µg/m³" },
          ],
        },
        {
          title: "SO₂",
          value: (Math.random() * 20).toFixed(1),
          unit: "µg/m³",
          icon: companiesData[0].stats[4].icon,
          description: "Stabilny poziom",
          details: [
            { label: "Norma WHO", value: "20 µg/m³" },
            { label: "Norma EU", value: "125 µg/m³" },
            { label: "Średnia 24h", value: "12.5 µg/m³" },
          ],
        },
        {
          title: "CO",
          value: (Math.random() * 4000).toFixed(0),
          unit: "µg/m³",
          icon: companiesData[0].stats[5].icon,
          description: "Dobry poziom",
          details: [
            { label: "Norma EU", value: "10000 µg/m³" },
            { label: "Średnia 8h", value: "3200 µg/m³" },
            { label: "Trend", value: "Stabilny" },
          ],
        },
        {
          title: "Indeks CAQI",
          value: (Math.random() * 100).toFixed(1),
          unit: "",
          icon: companiesData[0].stats[6].icon,
          description: "Dobra jakość powietrza",
          details: [
            { label: "Interpretacja", value: "Dobra" },
            { label: "Zalecenia", value: "Można przebywać na zewnątrz" },
            { label: "Trend", value: "Stabilny" },
          ],
        },
        {
          title: "Wilgotność",
          value: (40 + Math.random() * 30).toFixed(1),
          unit: "%",
          icon: companiesData[0].stats[7].icon,
          description: "Optymalna wilgotność",
          details: [
            { label: "Min 24h", value: "45%" },
            { label: "Max 24h", value: "65%" },
            { label: "Średnia", value: "55%" },
          ],
        },
      ],
      energyData: [
        { name: "00:00", consumption: 25, production: 12, efficiency: 91 },
        { name: "12:00", consumption: 45, production: 35, efficiency: 92 },
        { name: "23:59", consumption: 30, production: 20, efficiency: 91 },
      ],
    };

    companiesData.push(newProject);
    setSelectedCompanyId(newProject.id);

    toast({
      title: "Sukces",
      description: `Projekt "${newProjectName}" został dodany`,
    });

    setNewProjectName("");
    setIsDialogOpen(false);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedCompanyId(projectId);
    setIsTestListOpen(false);
  };

  const handleArchiveProject = (project: (typeof companiesData)[0]) => {
    const index = companiesData.findIndex(c => c.id === project.id);
    if (index !== -1) {
      const [removedProject] = companiesData.splice(index, 1);
      setArchivedProjects(prev => [...prev, removedProject]);
      toast({
        title: "Zarchiwizowano",
        description: `Projekt "${project.name}" został zarchiwizowany`,
      });
    }
  };

  const handleRestoreProject = (project: (typeof companiesData)[0]) => {
    const index = archivedProjects.findIndex(c => c.id === project.id);
    if (index !== -1) {
      const [restoredProject] = archivedProjects.splice(index, 1);
      companiesData.push(restoredProject);
      setArchivedProjects([...archivedProjects]);
      toast({
        title: "Przywrócono",
        description: `Projekt "${project.name}" został przywrócony`,
      });
    }
  };

  const getNewProjects = () => {
    return companiesData.slice(5);
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
                  {companiesData.map((project) => (
                    <li
                      key={project.id}
                      className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => handleProjectSelect(project.id)}
                    >
                      <span>{project.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchiveProject(project);
                        }}
                      >
                        <MinusCircle className="h-4 w-4 text-red-500" />
                      </Button>
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
              Dodaj projekt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nowy projekt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  placeholder="Nazwa projektu"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <Button onClick={handleAddProject} className="w-full">
                Dodaj
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {getNewProjects().length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Nowe projekty</h3>
          <ul className="space-y-2">
            {getNewProjects().map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => handleProjectSelect(project.id)}
              >
                <span>{project.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchiveProject(project);
                  }}
                >
                  <MinusCircle className="h-4 w-4 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {archivedProjects.length > 0 && (
        <div className="mt-4">
          <Separator className="my-4" />
          <h3 className="text-sm font-medium mb-2">Zarchiwizowane projekty</h3>
          <ul className="space-y-2">
            {archivedProjects.map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between text-sm text-muted-foreground"
              >
                <span>{project.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRestoreProject(project)}
                >
                  <RotateCcw className="h-4 w-4 text-green-500" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
