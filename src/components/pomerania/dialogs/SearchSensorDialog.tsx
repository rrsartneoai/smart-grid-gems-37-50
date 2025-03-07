
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { useState } from "react";

interface SearchSensorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (location: string, radius: number) => void;
}

export function SearchSensorDialog({ isOpen, onOpenChange, onSubmit }: SearchSensorDialogProps) {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(5);
  
  const handleSearch = () => {
    if (onSubmit && location) {
      onSubmit(location, radius);
    } else {
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] z-[9999]">
        <DialogHeader>
          <DialogTitle>Wyszukaj czujnik</DialogTitle>
          <DialogDescription>
            Wprowadź parametry wyszukiwania czujnika.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <FormLabel>Lokalizacja</FormLabel>
            <Input 
              placeholder="np. Gdańsk, Sopot, Gdynia" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <FormLabel>Promień wyszukiwania (km)</FormLabel>
            <Input 
              type="number" 
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              min="1" 
              max="50" 
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button onClick={handleSearch} disabled={!location}>
              Wyszukaj
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
