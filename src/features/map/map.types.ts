export interface GeoPoint {
  lat: number;
  lng: number;
  altitude?: number;
  heading?: number;
  speed?: number; // m/s or km/h depending on source
  accuracy?: number; // GPS location accuracy error radius in meters
  timestamp: number;
}

export type MapTileLayerType = 'osm' | 'positron' | 'dark' | 'satellite' | 'terrain';
export type MapLayerId = MapTileLayerType;
