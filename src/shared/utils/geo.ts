// * Geo utilities: location distance and lean angle calculations.
import { GeoPoint } from '../types';

/**
 * Calculates Haversine distance between two coordinates in Kilometers
 */
export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculates compass heading/bearing in degrees (0 - 360)
 */
export const calculateBearing = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(dLon) * Math.cos(radLat2);
  const x =
    Math.cos(radLat1) * Math.sin(radLat2) -
    Math.sin(radLat1) * Math.cos(radLat2) * Math.cos(dLon);

  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
};

/**
 * Default fallback coordinates: Pacific Coast Highway scenic ride or user default
 */
export const DEFAULT_COORDINATES: GeoPoint = {
  lat: 37.7749,
  lng: -122.4194,
  altitude: 18,
  heading: 145,
  speed: 48.5,
  timestamp: Date.now(),
};

/**
 * Computes next simulated point along a smooth path with slight curve
 */
export const simulateNextWaypoint = (
  prevPoint: GeoPoint,
  speedKmh: number,
  deltaSec: number = 1.5,
  curvature: number = 0.05
): GeoPoint => {
  // Convert speed km/h to distance in km
  const distanceKm = (speedKmh * deltaSec) / 3600;
  // Convert to approximate degrees (~111km per lat degree)
  const dLat = (distanceKm / 111) * Math.cos(((prevPoint.heading || 45) * Math.PI) / 180);
  const dLng =
    (distanceKm / (111 * Math.cos((prevPoint.lat * Math.PI) / 180))) *
    Math.sin(((prevPoint.heading || 45) * Math.PI) / 180);

  // Slight heading variation for realistic motorcycle path
  const newHeading = ((prevPoint.heading || 45) + (Math.random() - 0.48) * 10 * curvature + 360) % 360;
  const newAltitude = Math.max(5, (prevPoint.altitude || 20) + (Math.random() - 0.5) * 1.5);

  return {
    lat: prevPoint.lat + dLat,
    lng: prevPoint.lng + dLng,
    altitude: parseFloat(newAltitude.toFixed(1)),
    heading: Math.round(newHeading),
    speed: speedKmh,
    timestamp: Date.now(),
  };
};

/**
 * Format coordinates for quick display
 */
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(5)}°, ${lng.toFixed(5)}°`;
};
