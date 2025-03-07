
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RemoveSensorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RemoveSensorDialog({ isOpen, onOpenChange }: RemoveSensorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Zamknij
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
