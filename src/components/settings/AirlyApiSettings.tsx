
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DEFAULT_API_KEY = 'zORU0m4cOxlElF9X4YcvhaR3sfiiqgFP';

export function AirlyApiSettings() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('AIRLY_API_KEY') || '');
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = localStorage.getItem('AIRLY_API_KEY');
    if (!storedKey) {
      // Jeśli nie ma zapisanego klucza, używamy domyślnego
      localStorage.setItem('AIRLY_API_KEY', DEFAULT_API_KEY);
      setApiKey(DEFAULT_API_KEY);
    }
  }, []);

  const validateApiKey = async (key: string) => {
    try {
      const response = await fetch(
        'https://airapi.airly.eu/v2/sensors/installations', {
        headers: {
          'Accept': 'application/json',
          'apikey': key
        }
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleSaveApiKey = async () => {
    setIsValidating(true);
    const isValid = await validateApiKey(apiKey);
    setIsValidating(false);

    if (isValid) {
      localStorage.setItem('AIRLY_API_KEY', apiKey);
      toast({
        title: "Sukces",
        description: "Klucz API został pomyślnie zapisany.",
      });
      window.location.reload();
    } else {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Podany klucz API jest nieprawidłowy. Sprawdź czy został poprawnie skopiowany.",
      });
    }
  };

  const handleResetToDefault = () => {
    setApiKey(DEFAULT_API_KEY);
    localStorage.setItem('AIRLY_API_KEY', DEFAULT_API_KEY);
    toast({
      title: "Sukces",
      description: "Przywrócono domyślny klucz API.",
    });
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Konfiguruj klucz API Airly</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Klucz API Airly</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              id="apiKey"
              placeholder="Wprowadź klucz API Airly"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Możesz znaleźć swój klucz API w{" "}
              <a
                href="https://developer.airly.eu/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                panelu Airly
              </a>
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveApiKey} disabled={isValidating}>
              {isValidating ? "Sprawdzanie..." : "Zapisz klucz API"}
            </Button>
            <Button variant="secondary" onClick={handleResetToDefault}>
              Przywróć domyślny klucz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
