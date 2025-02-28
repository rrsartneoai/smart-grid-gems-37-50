
import { LatLngExpression } from 'leaflet';

export const mapCenter: LatLngExpression = [54.460, 18.5305]; // Center point between Gdańsk and Gdynia

export const defaultMapOptions = {
  zoom: 11, // Adjusted zoom to show both cities
  minZoom: 10,
  maxZoom: 18
};

export const CITIES = [
  { name: 'Gdańsk', lat: 54.372158, lon: 18.638306 },
  { name: 'Gdynia', lat: 54.5189, lon: 18.5305 }
] as const;
