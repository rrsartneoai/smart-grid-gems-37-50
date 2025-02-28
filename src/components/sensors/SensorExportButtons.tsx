
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface SensorExportButtonsProps {
  sensorsPanelId: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sensorsData: any;  // Using any since the actual type is complex
}

export const SensorExportButtons = ({ 
  sensorsPanelId, 
  searchQuery, 
  setSearchQuery,
  sensorsData
}: SensorExportButtonsProps) => {
  const { t } = useTranslation();

  const handleExport = async (format: 'pdf' | 'jpg' | 'xlsx' | 'csv') => {
    const element = document.getElementById(sensorsPanelId);
    if (!element) return;

    try {
      if (format === 'pdf' || format === 'jpg') {
        const canvas = await html2canvas(element);
        if (format === 'pdf') {
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
          pdf.save('sensors-data.pdf');
        } else {
          const link = document.createElement('a');
          link.download = 'sensors-data.jpg';
          link.href = canvas.toDataURL('image/jpeg');
          link.click();
        }
      } else {
        const data = Object.entries(sensorsData).map(([city, cityData]: [string, any]) => {
          const sensorReadings = cityData.sensors.reduce((acc: any, sensor: any) => ({
            ...acc,
            [`${sensor.name} (${sensor.unit})`]: sensor.value
          }), {});

          return {
            City: cityData.name,
            ...sensorReadings
          };
        });

        if (format === 'xlsx') {
          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Sensor Data");
          XLSX.writeFile(wb, "sensor-data.xlsx");
        } else {
          const ws = XLSX.utils.json_to_sheet(data);
          const csv = XLSX.utils.sheet_to_csv(ws);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement("a");
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "sensor-data.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      
      toast.success(`Eksport do ${format.toUpperCase()} zakończony sukcesem`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Błąd podczas eksportu do ${format.toUpperCase()}`);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 bg-card p-4 rounded-lg shadow-sm">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchSensors')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => handleExport('pdf')}
          variant="outline"
          className="bg-primary/10 hover:bg-primary/20 text-primary"
        >
          {t('exportToPDF')}
        </Button>
        <Button
          onClick={() => handleExport('jpg')}
          variant="outline"
          className="bg-primary/10 hover:bg-primary/20 text-primary"
        >
          {t('exportToJPG')}
        </Button>
        <Button
          onClick={() => handleExport('xlsx')}
          variant="outline"
          className="bg-primary/10 hover:bg-primary/20 text-primary"
        >
          {t('exportToExcel')}
        </Button>
        <Button
          onClick={() => handleExport('csv')}
          variant="outline"
          className="bg-primary/10 hover:bg-primary/20 text-primary"
        >
          {t('exportToCSV')}
        </Button>
      </div>
    </div>
  );
};
