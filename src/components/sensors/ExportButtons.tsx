
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { useTranslation } from "react-i18next";
import { sensorsData } from "./SensorsData";

export const ExportButtons = () => {
  const { t } = useTranslation();

  const handleExport = async (format: 'pdf' | 'jpg' | 'xlsx' | 'csv') => {
    const element = document.getElementById('sensors-panel');
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
        const data = Object.entries(sensorsData).map(([city, cityData]) => {
          const sensorReadings = cityData.sensors.reduce((acc, sensor) => ({
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
  );
};
