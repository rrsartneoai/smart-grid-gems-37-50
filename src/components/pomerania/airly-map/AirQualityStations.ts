
// Air quality station data for Tricity area (Trójmiasto)
export const AQICN_STATIONS = [
  {
    id: "gdynia-pogorze",
    name: "Gdynia Pogórze",
    address: { street: "Pogórze" },
    location: { latitude: 54.561, longitude: 18.493 },
    current: {
      indexes: [{ name: "CAQI", value: 43, level: "moderate", color: "#FFFF00", description: "Umiarkowana", advice: "Osoby wrażliwe powinny ograniczyć przebywanie na zewnątrz" }],
      pm25: 21.5,
      pm10: 28.3,
      o3: 87.2,
      no2: 5.8,
      so2: 3.1,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "sopot",
    name: "Sopot",
    address: { street: "Bitwy pod Płowcami" },
    location: { latitude: 54.441, longitude: 18.562 },
    current: {
      indexes: [{ name: "CAQI", value: 32, level: "good", color: "#9ACD32", description: "Dobra", advice: "Jakość powietrza jest zadowalająca" }],
      pm25: 15.8,
      pm10: 21.6,
      o3: 75.4,
      no2: 8.2,
      so2: 2.7,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdansk-srodmiescie",
    name: "Gdańsk Śródmieście",
    address: { street: "Śródmieście" },
    location: { latitude: 54.353, longitude: 18.647 },
    current: {
      indexes: [{ name: "CAQI", value: 38, level: "moderate", color: "#FFFF00", description: "Umiarkowana", advice: "Jakość powietrza jest akceptowalna" }],
      pm25: 18.9,
      pm10: 24.7,
      o3: 81.3,
      no2: 12.5,
      so2: 3.5,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdansk-stogi",
    name: "Gdańsk Stogi",
    address: { street: "Stogi" },
    location: { latitude: 54.358, longitude: 18.693 },
    current: {
      indexes: [{ name: "CAQI", value: 45, level: "moderate", color: "#FFFF00", description: "Umiarkowana", advice: "Ograniczenie aktywności na zewnątrz dla wrażliwych osób" }],
      pm25: 22.4,
      pm10: 29.8,
      o3: 72.1,
      no2: 15.7,
      so2: 4.3,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdansk-wrzeszcz",
    name: "Gdańsk Wrzeszcz",
    address: { street: "Wrzeszcz" },
    location: { latitude: 54.378, longitude: 18.620 },
    current: {
      indexes: [{ name: "CAQI", value: 35, level: "good", color: "#9ACD32", description: "Dobra", advice: "Jakość powietrza jest zadowalająca" }],
      pm25: 17.2,
      pm10: 22.9,
      o3: 79.5,
      no2: 9.8,
      so2: 3.2,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdansk-nowy-port",
    name: "Gdańsk Nowy Port",
    address: { street: "Nowy Port" },
    location: { latitude: 54.400, longitude: 18.665 },
    current: {
      indexes: [{ name: "CAQI", value: 40, level: "moderate", color: "#FFFF00", description: "Umiarkowana", advice: "Jakość powietrza jest akceptowalna" }],
      pm25: 19.8,
      pm10: 26.3,
      o3: 73.8,
      no2: 13.4,
      so2: 3.9,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdynia-srodmiescie",
    name: "Gdynia Śródmieście",
    address: { street: "Śródmieście" },
    location: { latitude: 54.518, longitude: 18.531 },
    current: {
      indexes: [{ name: "CAQI", value: 33, level: "good", color: "#9ACD32", description: "Dobra", advice: "Brak ograniczeń" }],
      pm25: 16.5,
      pm10: 22.1,
      o3: 82.7,
      no2: 7.6,
      so2: 2.9,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdynia-dabrowa",
    name: "Gdynia Dąbrowa",
    address: { street: "Dąbrowa" },
    location: { latitude: 54.474, longitude: 18.475 },
    current: {
      indexes: [{ name: "CAQI", value: 37, level: "moderate", color: "#FFFF00", description: "Umiarkowana", advice: "Jakość powietrza jest akceptowalna" }],
      pm25: 18.4,
      pm10: 24.1,
      o3: 76.9,
      no2: 8.9,
      so2: 3.1,
      fromDateTime: new Date().toISOString()
    }
  },
  // Additional stations 
  {
    id: "gdansk-szadolki",
    name: "Gdańsk Szadółki",
    address: { street: "Szadółki" },
    location: { latitude: 54.3285, longitude: 18.5299 },
    current: {
      indexes: [{ name: "CAQI", value: 39, level: "moderate", color: "#FFFF00", description: "Umiarkowana", advice: "Jakość powietrza jest akceptowalna" }],
      pm25: 19.2,
      pm10: 25.6,
      o3: 68.7,
      no2: 11.3,
      so2: 3.8,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdansk-jasien",
    name: "Gdańsk Jasień",
    address: { street: "Jasień" },
    location: { latitude: 54.3396, longitude: 18.5799 },
    current: {
      indexes: [{ name: "CAQI", value: 36, level: "good", color: "#9ACD32", description: "Dobra", advice: "Jakość powietrza jest dobra" }],
      pm25: 17.9,
      pm10: 23.8,
      o3: 74.2,
      no2: 9.1,
      so2: 2.8,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdynia-wielki-kack",
    name: "Gdynia Wielki Kack",
    address: { street: "Wielki Kack" },
    location: { latitude: 54.4652, longitude: 18.4899 },
    current: {
      indexes: [{ name: "CAQI", value: 34, level: "good", color: "#9ACD32", description: "Dobra", advice: "Brak ograniczeń" }],
      pm25: 16.8,
      pm10: 22.7,
      o3: 80.1,
      no2: 8.3,
      so2: 3.0,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdynia-oksywie",
    name: "Gdynia Oksywie",
    address: { street: "Oksywie" },
    location: { latitude: 54.5486, longitude: 18.5463 },
    current: {
      indexes: [{ name: "CAQI", value: 35, level: "good", color: "#9ACD32", description: "Dobra", advice: "Brak ograniczeń" }],
      pm25: 17.5,
      pm10: 23.4,
      o3: 81.5,
      no2: 7.9,
      so2: 2.6,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "sopot-kamienny-potok",
    name: "Sopot Kamienny Potok",
    address: { street: "Kamienny Potok" },
    location: { latitude: 54.4613, longitude: 18.5599 },
    current: {
      indexes: [{ name: "CAQI", value: 31, level: "good", color: "#9ACD32", description: "Dobra", advice: "Jakość powietrza jest zadowalająca" }],
      pm25: 15.2,
      pm10: 20.9,
      o3: 77.8,
      no2: 7.1,
      so2: 2.5,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdansk-oliwa",
    name: "Gdańsk Oliwa",
    address: { street: "Oliwa" },
    location: { latitude: 54.4119, longitude: 18.5499 },
    current: {
      indexes: [{ name: "CAQI", value: 33, level: "good", color: "#9ACD32", description: "Dobra", advice: "Jakość powietrza jest zadowalająca" }],
      pm25: 16.3,
      pm10: 21.8,
      o3: 78.3,
      no2: 8.7,
      so2: 2.8,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdansk-przymorze",
    name: "Gdańsk Przymorze",
    address: { street: "Przymorze" },
    location: { latitude: 54.4012, longitude: 18.5892 },
    current: {
      indexes: [{ name: "CAQI", value: 37, level: "moderate", color: "#FFFF00", description: "Umiarkowana", advice: "Jakość powietrza jest akceptowalna" }],
      pm25: 18.6,
      pm10: 24.5,
      o3: 75.8,
      no2: 9.5,
      so2: 3.1,
      fromDateTime: new Date().toISOString()
    }
  },
  {
    id: "gdansk-chelm",
    name: "Gdańsk Chełm",
    address: { street: "Chełm" },
    location: { latitude: 54.3452, longitude: 18.6289 },
    current: {
      indexes: [{ name: "CAQI", value: 41, level: "moderate", color: "#FFFF00", description: "Umiarkowana", advice: "Jakość powietrza jest akceptowalna" }],
      pm25: 20.3,
      pm10: 26.9,
      o3: 70.4,
      no2: 12.8,
      so2: 3.7,
      fromDateTime: new Date().toISOString()
    }
  }
];
