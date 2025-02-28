
import { LatLngExpression } from 'leaflet';

// Center point between Gdańsk and Gdynia - updated to be a proper LatLngExpression
export const mapCenter: LatLngExpression = [54.460, 18.5305];

export const defaultMapOptions = {
  zoom: 11, // Adjusted zoom to show both cities
  minZoom: 10,
  maxZoom: 18
};

// Ensure the lat/lon coordinates are specified in the correct format for Leaflet
export const CITIES = [
  { name: 'Gdańsk', lat: 54.372158, lng: 18.638306 },
  { name: 'Gdynia', lat: 54.5189, lng: 18.5305 }
] as const;
