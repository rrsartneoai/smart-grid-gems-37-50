import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  Legend, Area, AreaChart, ComposedChart, Scatter,
  XAxis, YAxis, Tooltip
} from "recharts";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { UploadOptions } from "./UploadOptions";
import { ExportButtons } from "./ExportButtons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const energyData = [
  { name: 'Styczeń', value: 400 },
  { name: 'Luty', value: 300 },
  { name: 'Marzec', value: 200 },
  { name: 'Kwiecień', value: 278 },
  { name: 'Maj', value: 189 },
];

const sourceData = [
  { name: 'Węgiel', value: 400 },
  { name: 'Gaz', value: 300 },
  { name: 'Odnawialne', value: 300 },
  { name: 'Inne', value: 200 },
];

const forecastData = [
  { name: 'Styczeń', actual: 400, forecast: 450 },
  { name: 'Luty', actual: 300, forecast: 350 },
  { name: 'Marzec', actual: 200, forecast: 250 },
  { name: 'Kwiecień', actual: 278, forecast: 300 },
  { name: 'Maj', actual: 189, forecast: 220 },
];

export function CompanyAnalysis() {
  const [showForecast, setShowForecast] = useState(false);
  const { toast } = useToast();
  const selectedCompany = {
    name: "EnergiaPro S.A.",
  };

  const handleExport = async (format: 'pdf' | 'jpg' | 'xlsx' | 'csv') => {
    try {
      const element = document.getElementById('analysis-content');
      if (!element) {
        throw new Error('Content element not found');
      }

      switch (format) {
        case 'pdf': {
          const canvas = await html2canvas(element, {
            logging: false,
            useCORS: true,
            allowTaint: true
          });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`energiapro-analysis.pdf`);
          break;
        }
        case 'jpg': {
          const canvas = await html2canvas(element, {
            logging: false,
            useCORS: true,
            allowTaint: true
          });
          const link = document.createElement('a');
          link.download = 'energiapro-analysis.jpg';
          link.href = canvas.toDataURL('image/jpeg');
          link.click();
          break;
        }
        case 'xlsx': {
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet([
            { date: '2024-01', consumption: 150, production: 200 },
            { date: '2024-02', consumption: 160, production: 210 },
          ]);
          XLSX.utils.book_append_sheet(wb, ws, "Analysis");
          XLSX.writeFile(wb, "energiapro-analysis.xlsx");
          break;
        }
        case 'csv': {
          const data = [
            ['Date', 'Consumption', 'Production'],
            ['2024-01', 150, 200],
            ['2024-02', 160, 210],
          ];
          const csvContent = data.map(row => row.join(',')).join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'energiapro-analysis.csv';
          link.click();
          break;
        }
      }

      toast({
        title: "Eksport zakończony",
        description: `Plik został wyeksportowany w formacie ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        variant: "destructive",
        title: "Błąd eksportu",
        description: "Nie udało się wyeksportować danych. Spróbuj ponownie.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Analiza - {selectedCompany?.name}
        </h2>
        <ExportButtons 
          onExport={handleExport}
          onGenerateForecast={() => setShowForecast(true)}
          showForecast={showForecast}
        />
      </div>

      <div id="analysis-content" className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Zużycie energii</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={energyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Źródła energii</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {showForecast && (
          <Card>
            <CardHeader>
              <CardTitle>Prognoza zużycia energii</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={forecastData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="actual" fill="#8884d8" stroke="#8884d8" />
                  <Scatter dataKey="forecast" fill="#82ca9d" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      <UploadOptions />
    </div>
  );
}