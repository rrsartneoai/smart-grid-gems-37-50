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

export function CompanyActions() {
  const [isTestListOpen, setIsTestListOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddCompany = () => {
    if (!newCompanyName.trim()) {
      toast({
        title: "Błąd",
        description: "Nazwa firmy nie może być pusta",
        variant: "destructive",
      });
      return;
    }

    // Add company logic here (in a real app, this would be an API call)
    toast({
      title: "Sukces",
      description: `Firma "${newCompanyName}" została dodana`,
    });

    setNewCompanyName("");
    setIsDialogOpen(false);
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