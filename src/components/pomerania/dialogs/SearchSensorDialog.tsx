
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";

interface SearchSensorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchSensorDialog({ isOpen, onOpenChange }: SearchSensorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button>Wyszukaj</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
