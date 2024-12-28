import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from "react-i18next";

interface ChartProps {
  data: Array<{
    time: string;
    efficiency: number;
    consumption: number;
    production: number;
  }>;
}

export function PerformanceChart({ data }: ChartProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-6 bg-[#0a0f1c] border-[#1f2937]">
      <h3 className="text-lg font-semibold mb-4 text-white">Trendy zużycia energii</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend 
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ 
                paddingTop: "20px",
                color: '#fff'
              }}
            />
            <Line
              type="monotone"
              dataKey="consumption"
              name="Zużycie"
              stroke="#818cf8"
              strokeWidth={2}
              dot={{ fill: '#818cf8', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="production"
              name="Produkcja"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ fill: '#34d399', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}