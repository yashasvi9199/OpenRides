// * LiveRideMap Component: MapLibre GL WebGL 3D map canvas rendering.
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// * Configure MapLibre Web Worker URL via standard ECMAScript URL resolution
if (typeof window !== 'undefined' && (maplibregl as any).setWorkerUrl) {
  try {
    const workerUrl = new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url).href;
    (maplibregl as any).setWorkerUrl(workerUrl);
  } catch {
    // Fall back to MapLibre default bundled worker resolution
  }
}

import { RideSession, MapTileLayerType, GeoPoint } from '../../shared/types';
import { MAP_LAYERS, DEFAULT_MAP_LAYER, OSM_RASTER_STYLE } from './MapLayers';
import { createRiderMarkerElement, createStartMarkerElement, createBlueDotMarkerElement } from './CustomMarkers';
import { MapControls } from './MapControls';
import { ShieldAlert, Navigation2, Trash2, MapPin } from 'lucide-react';
import { formatTimestamp } from '../../shared/utils/formatters';
import { useRideStore } from '../ride/rideStore';
import './map.styles.css';

interface LiveRideMapProps {
  session: RideSession;
  onManualRefresh: () => void;
  className?: string;
  isFamilyMode?: boolean;
}

export const LiveRideMap: React.FC<LiveRideMapProps> = React.memo(({
  session,
  onManualRefresh,
  className = 'h-[460px] sm:h-[580px] w-full',
  isFamilyMode = false,
}) => {
  // * Layer & Map view trackers
  const [selectedLayer, setSelectedLayer] = useState<MapTileLayerType>(DEFAULT_MAP_LAYER);
  const activeLayerRef = useRef<MapTileLayerType>(DEFAULT_MAP_LAYER);
  const [isAutoFollow, setIsAutoFollow] = useState(true);
  const [locationError, setLocationError] = useState(false);

  // * Checkpoint & Autocomplete states
  const [checkpointMode, setCheckpointMode] = useState(false);
  const [checkpoints, setCheckpoints] = useState<GeoPoint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // * Canvas & Layer DOM Ref binders
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});
  const startMarkerRef = useRef<maplibregl.Marker | null>(null);
  const checkpointMarkersRef = useRef<maplibregl.Marker[]>([]);
  const blueDotMarkerRef = useRef<maplibregl.Marker | null>(null);

  const hostParticipant = session.participants.find((p) => p.role === 'host') || session.participants[0];
  const currentPos = hostParticipant?.currentPosition || { lat: 37.7749, lng: -122.4194 };

  const startPoint = session.route.length > 0 ? session.route[0] : null;

  // ! OSRM Routing Fetch API connector
  const fetchOSRMRoute = async (points: GeoPoint[]) => {
    if (points.length < 2) return;
    const coordsString = points.map(p => `${p.lng},${p.lat}`).join(';');
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`);
      const data: any = await res.json();
      if (data.routes && data.routes[0]) {
        const geojson = data.routes[0].geometry;
        updateRouteLayer(geojson);
      }
    } catch (e) {
      console.error('OSRM route generation failed', e);
    }
  };

  // * Update WebGL Route Polyline source
  const updateRouteLayer = (geojson: any) => {
    const map = mapRef.current;
    if (!map) return;
    const sourceId = 'route-source';
    const layerId = 'route-layer';

    const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(geojson);
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojson
      });
      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#06b6d4',
          'line-width': 5,
          'line-opacity': 0.85
        }
      });
    }
  };

  // * Clear routing tracks
  const clearRoute = () => {
    setCheckpoints([]);
    checkpointMarkersRef.current.forEach(m => m.remove());
    checkpointMarkersRef.current = [];
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource('route-source') as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: []
      });
    }
  };

  // * Photon Autocomplete Geocoder queries
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=${currentPos.lat}&lon=${currentPos.lng}`);
      const data: any = await res.json();
      setSearchResults(data.features || []);
    } catch (e) {
      console.error('Photon search failed', e);
    }
  };

  // ? Map Control Button Callbacks
  const handleRecenter = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [currentPos.lng, currentPos.lat],
        zoom: 15,
        pitch: 45,
        essential: true
      });
    }
  }, [currentPos]);

  const handleZoomIn = useCallback(() => {
    if (mapRef.current) mapRef.current.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) mapRef.current.zoomOut();
  }, []);

  // * Connect to global tracking store slice
  const { updateCurrentPosition } = useRideStore();

  // * Geolocation lookup executor
  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setLocationError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, heading, speed } = position.coords;
        setLocationError(false);
        if (mapRef.current) {
          mapRef.current.setCenter([longitude, latitude]);
        }
        
        updateCurrentPosition({
          lat: latitude,
          lng: longitude,
          altitude: position.coords.altitude || 0,
          heading: heading || 0,
          speed: speed ? speed * 3.6 : 0,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        });
      },
      (error) => {
        console.debug('Failed to query precise coordinates:', error);
        setLocationError(true);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  }, [updateCurrentPosition]);

  // * Initialize MapLibre Map Ref Canvas & Query User GPS Coordinates on Mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialStyle = MAP_LAYERS[selectedLayer] || OSM_RASTER_STYLE;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [currentPos.lng, currentPos.lat],
      zoom: 15,
      pitch: 45,
      bearing: -17.6,
      pitchWithRotate: true,
      dragRotate: true,
      maxPitch: 60,
    });

    mapRef.current = map;

    // Error fallback listener: if tile style fails, gracefully switch to standard OSM raster
    map.on('error', (e) => {
      console.warn('MapLibre error encountered:', e.error);
      if (e.error && (e as any).sourceId !== 'osm-tiles') {
        try {
          map.setStyle(OSM_RASTER_STYLE);
        } catch (styleErr) {
          console.error('Failed to set fallback OSM style:', styleErr);
        }
      }
    });

    // ResizeObserver ensures canvas always fills container
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    // Initial resize trigger after mount
    setTimeout(() => {
      map.resize();
    }, 100);

    // Query initial position using Geolocation API
    requestLocation();

    return () => {
      resizeObserver.disconnect();
      if (blueDotMarkerRef.current) {
        blueDotMarkerRef.current.remove();
        blueDotMarkerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, [requestLocation]);

  // * Layer Switcher Effect
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (activeLayerRef.current === selectedLayer) return;
    activeLayerRef.current = selectedLayer;

    const targetStyle = MAP_LAYERS[selectedLayer] || OSM_RASTER_STYLE;

    const handleStyleLoad = () => {
      if (selectedLayer === 'terrain') {
        if (!map.getSource('terrainSource')) {
          map.addSource('terrainSource', {
            type: 'raster-dem',
            tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
            encoding: 'terrarium',
            tileSize: 256
          });
        }
        try {
          map.setTerrain({ source: 'terrainSource', exaggeration: 1.5 });
        } catch {
          // terrain unsupported on current canvas context
        }
      } else {
        try {
          map.setTerrain(null);
        } catch {
          // ignore
        }
      }

      if (checkpoints.length > 0) {
        fetchOSRMRoute([currentPos, ...checkpoints]);
      }
    };

    map.once('style.load', handleStyleLoad);
    map.setStyle(targetStyle);
  }, [selectedLayer, checkpoints, currentPos]);

  // * Map click handlers inside Checkpoint addition mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMapClick = (e: maplibregl.MapMouseEvent) => {
      if (!checkpointMode) return;
      const { lng, lat } = e.lngLat;
      const newPoint: GeoPoint = { lat, lng, timestamp: Date.now() };

      const pinEl = document.createElement('div');
      pinEl.className = 'w-6 h-6 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-lg';
      pinEl.innerHTML = (checkpoints.length + 1).toString();

      const marker = new maplibregl.Marker({ element: pinEl })
        .setLngLat([lng, lat])
        .addTo(map);

      checkpointMarkersRef.current.push(marker);

      setCheckpoints(prev => {
        const next = [...prev, newPoint];
        fetchOSRMRoute([currentPos, ...next]);
        return next;
      });
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [checkpointMode, checkpoints, currentPos]);

  // * Active Marker Sync loop
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentParticipantIds = new Set(session.participants.map(p => p.id));

    // Remove stale group markers
    Object.keys(markersRef.current).forEach(id => {
      if (!currentParticipantIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Create or position approved riders
    session.participants.forEach(participant => {
      const isHost = participant.role === 'host';
      const isSOS = participant.isSOS || session.status === 'sos';
      const lng = participant.currentPosition.lng;
      const lat = participant.currentPosition.lat;

      const el = createRiderMarkerElement(participant, isHost, isSOS);

      if (markersRef.current[participant.id]) {
        markersRef.current[participant.id].setLngLat([lng, lat]);
        const markerElement = markersRef.current[participant.id].getElement();
        markerElement.innerHTML = el.innerHTML;
      } else {
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div class="p-3 text-slate-900 font-sans min-w-[200px]">
              <div class="flex items-center justify-between gap-2 border-b pb-1.5 mb-2">
                <span class="font-black text-sm text-slate-900">${participant.name}</span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800">
                  ${isHost ? 'RIDE LEADER' : 'WINGMAN'}
                </span>
              </div>
              <p class="text-xs font-semibold text-slate-700 mb-2">🏍️ ${participant.bikeModel}</p>
              <div class="grid grid-cols-2 gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mb-2.5">
                <div>Speed: ${participant.speedKmh} km/h</div>
                <div>Battery: ${participant.batteryPct}%</div>
              </div>
              <a href="tel:${participant.phone}" class="flex items-center justify-center gap-1.5 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-1.5 rounded-lg transition-colors">
                Call Rider
              </a>
            </div>
          `))
          .addTo(map);
        markersRef.current[participant.id] = marker;
      }
    });

    // Render blue dot current position marker
    if (blueDotMarkerRef.current) {
      blueDotMarkerRef.current.setLngLat([currentPos.lng, currentPos.lat]);
    } else {
      const el = createBlueDotMarkerElement();
      blueDotMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([currentPos.lng, currentPos.lat])
        .addTo(map);
    }

    if (isAutoFollow) {
      map.panTo([currentPos.lng, currentPos.lat]);
    }
  }, [session.participants, isAutoFollow, currentPos, session.status]);

  // * Starting origin point marker sync
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !startPoint) {
      if (startMarkerRef.current) {
        startMarkerRef.current.remove();
        startMarkerRef.current = null;
      }
      return;
    }

    if (startMarkerRef.current) {
      startMarkerRef.current.setLngLat([startPoint.lng, startPoint.lat]);
    } else {
      const el = createStartMarkerElement();
      startMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([startPoint.lng, startPoint.lat])
        .setPopup(new maplibregl.Popup({ offset: 15 }).setHTML(`
          <div class="p-2 text-slate-900 font-sans">
            <p class="font-bold text-xs uppercase text-emerald-700">Ride Origin Point</p>
            <p class="text-[11px] text-slate-600">${formatTimestamp(startPoint.timestamp)}</p>
          </div>
        `))
        .addTo(map);
    }
  }, [startPoint]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950 ${className}`}>
      {/* Autocomplete Search input overlay */}
      <div className="absolute top-4 left-4 z-[400] w-[calc(100%-8rem)] max-w-xs sm:max-w-sm pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search destination..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2.5 text-xs text-slate-100 bg-transparent focus:outline-none placeholder:text-slate-400 font-sans"
          />
          {searchResults.length > 0 && (
            <div className="border-t border-slate-700 max-h-48 overflow-y-auto bg-slate-900">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const [lng, lat] = result.geometry.coordinates;
                    if (mapRef.current) {
                      mapRef.current.flyTo({
                        center: [lng, lat],
                        zoom: 14,
                        pitch: 45,
                        essential: true
                      });
                    }
                    setSearchResults([]);
                    setSearchQuery(result.properties.name || '');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-800 text-[11px] text-slate-300 border-b border-slate-800 last:border-0 block truncate"
                >
                  <strong className="text-slate-100">{result.properties.name}</strong>
                  {result.properties.city && ` • ${result.properties.city}`}
                  {result.properties.country && ` • ${result.properties.country}`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Checkpoint controller */}
      <div className="absolute top-18 left-4 z-[400] flex gap-2 pointer-events-auto">
        <button
          onClick={() => setCheckpointMode(!checkpointMode)}
          className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
            checkpointMode
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
          }`}
        >
          <Navigation2 className="w-3.5 h-3.5" />
          <span>{checkpointMode ? 'Tap Map to Add Stop' : 'Add Checkpoints'}</span>
        </button>

        {checkpoints.length > 0 && (
          <button
            onClick={clearRoute}
            className="flex items-center justify-center p-2 bg-slate-900/90 hover:bg-red-950/50 text-red-400 border border-slate-700 hover:border-red-500/50 rounded-xl transition-all shadow-md cursor-pointer"
            title="Clear route checkpoints"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Map Control Overlay */}
      <MapControls
        currentLayer={selectedLayer}
        onLayerChange={setSelectedLayer}
        onRecenter={handleRecenter}
        onManualRefresh={onManualRefresh}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        lastUpdated={session.lastUpdated}
        isAutoFollow={isAutoFollow}
        onToggleAutoFollow={() => setIsAutoFollow(!isAutoFollow)}
        heading={currentPos.heading || 0}
      />

      {/* Top Banner for Status or SOS */}
      {session.status === 'sos' && (
        <div className="absolute top-4 right-20 z-[400] bg-red-600/95 text-white px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl shadow-red-600/50 animate-pulse border border-red-400">
          <ShieldAlert className="w-5 h-5 animate-spin" />
          <span>LIVE SOS BEACON BROADCASTING</span>
        </div>
      )}

      {isFamilyMode && session.status !== 'sos' && (
        <div className="absolute top-4 right-20 z-[400] bg-slate-900/90 backdrop-blur-md text-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Family Guardian Tracking</span>
        </div>
      )}

      {/* Map Canvas Container - always mounted */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] sm:min-h-[580px] relative" />

      {/* Non-destructive Location Notice Overlay */}
      {locationError && (
        <div className="absolute top-18 right-4 z-[400] max-w-xs bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-amber-500/40 shadow-xl flex items-center gap-2.5 text-white">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-[11px] leading-tight text-slate-300">
            <span className="font-bold text-amber-300 block">Using Default Location</span>
            Enable location services to track real coordinates.
          </div>
          <button
            onClick={requestLocation}
            className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold rounded-lg shrink-0 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Map Bottom Telemetry Ticker */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-[400] bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 shadow-xl flex items-center justify-between sm:justify-start gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${session.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
            {session.status === 'active' ? 'Live Telemetry' : session.status}
          </span>
        </div>
        <div className="text-xs text-slate-300 font-mono font-medium">
          {session.participants.length} Active Riders
        </div>
        <div className="hidden sm:block text-xs text-cyan-400 font-mono font-bold">
          Heading: {currentPos.heading || 0}°
        </div>
      </div>
    </div>
  );
});

LiveRideMap.displayName = 'LiveRideMap';
