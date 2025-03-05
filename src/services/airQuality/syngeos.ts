import { AirQualityData, AirQualityIndex, AirQualitySource } from '@/types';

// Placeholder function for fetching data from Syngeos
export const fetchSyngeosData = async (): Promise<AirQualityData[]> => {
  // In real implementation, you would fetch data from Syngeos API
  // and transform it into the AirQualityData format.
  // This is just a placeholder to simulate the data.

  const syngeosData: AirQualityData[] = [
    {
      source: {
        id: 'syngeos-gdansk',
        name: 'Gdańsk Syngeos Station',
        provider: 'Syngeos',
        location: {
          latitude: 54.3520,
          longitude: 18.6466,
        },
      },
      current: {
        indexes: [
          {
            name: 'Overall AQI',
            value: 65,
            level: 'Moderate',
            description: 'Acceptable air quality',
            advice: 'Enjoy your outdoor activities.',
            color: '#FFFF00',
          },
        ],
        pm25: 20,
        pm10: 35,
        no2: 15,
        o3: 45,
        so2: 5,
        co: 2,
        temperature: 22,
        pressure: 1012,
        humidity: 60,
        wind: 5,
        timestamp: new Date().toISOString(),
        provider: 'Syngeos',
      },
      historicalData: [
        {
          parameter: 'pm25',
          values: [18, 22, 25, 23, 20, 19, 21],
          timestamps: [
            '2024-05-03T09:00:00Z',
            '2024-05-03T10:00:00Z',
            '2024-05-03T11:00:00Z',
            '2024-05-03T12:00:00Z',
            '2024-05-03T13:00:00Z',
            '2024-05-03T14:00:00Z',
            '2024-05-03T15:00:00Z',
          ],
          min: 18,
          max: 25,
        },
      ],
    },
  ];

  return syngeosData;
};
