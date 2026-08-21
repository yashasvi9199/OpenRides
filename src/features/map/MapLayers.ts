// * Map Layers config: MapLibre GL style targets and raster map setups.
// ? Positron style acts as the main light vector style.
export const MAP_LAYERS: Record<string, any> = {
  // * Carto Dark Matter GL Style JSON config provides high-contrast nighttime styling
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  positron: 'https://tiles.openfreemap.org/styles/positron',
  satellite: {
    version: 8,
    sources: {
      'satellite-tiles': {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri'
      }
    },
    layers: [
      {
        id: 'satellite-layer',
        type: 'raster',
        source: 'satellite-tiles'
      }
    ]
  },
  terrain: {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap'
      },
      'terrainSource': {
        type: 'raster-dem',
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        encoding: 'terrarium',
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'osm-layer',
        type: 'raster',
        source: 'osm-tiles'
      }
    ]
  }
};

