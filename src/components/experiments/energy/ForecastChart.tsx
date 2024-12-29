import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { PowerForecast, ConsumptionForecast } from '@/types/electricity';

interface ForecastChartProps {
  productionForecast: PowerForecast;
  consumptionForecast: ConsumptionForecast;
}

export const ForecastChart = ({ productionForecast, consumptionForecast }: ForecastChartProps) => {
  const data = productionForecast.forecast.map((prod, index) => {
    const cons = consumptionForecast.forecast[index];
    return {
      time: new Date(prod.datetime).toLocaleTimeString(),
      production: prod.powerProductionTotal,
      consumption: cons?.powerConsumptionTotal || 0
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="production" stroke="#8884d8" name="Production" />
        <Line type="monotone" dataKey="consumption" stroke="#82ca9d" name="Consumption" />
      </LineChart>
    </ResponsiveContainer>
  );
};