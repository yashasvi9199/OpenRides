export interface GeoPoint {
  lat: number;
  lng: number;
  altitude?: number;
  heading?: number;
  speed?: number; // m/s or km/h depending on source
  timestamp: number;
}

export type MapTileLayerType = 'osm' | 'dark' | 'satellite' | 'terrain';
