import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { RideSession, MapTileLayerType, GeoPoint } from '../../shared/types';
import { MAP_LAYERS } from './MapLayers';
import { createRiderMarkerIcon, createStartMarkerIcon } from './CustomMarkers';
import { MapControls } from './MapControls';
import { Phone, Battery, Gauge, UserCheck, ShieldAlert } from 'lucide-react';
import { formatTimestamp } from '../../shared/utils/formatters';
import './map.styles.css';

interface LiveRideMapProps {
  session: RideSession;
  onManualRefresh: () => void;
  className?: string;
  isFamilyMode?: boolean;
}

// Map helper component to handle dynamic programmatic map view pan/zoom
const MapController: React.FC<{
  center: [number, number];
  isAutoFollow: boolean;
  triggerRecenter: number;
  triggerZoomIn: number;
  triggerZoomOut: number;
}> = ({ center, isAutoFollow, triggerRecenter, triggerZoomIn, triggerZoomOut }) => {
  const map = useMap();

  useEffect(() => {
    if (isAutoFollow) {
      map.panTo(center, { animate: true, duration: 1 });
    }
  }, [center, isAutoFollow, map]);

  useEffect(() => {
    if (triggerRecenter > 0) {
      map.flyTo(center, 15, { animate: true, duration: 1.2 });
    }
  }, [triggerRecenter, center, map]);

  useEffect(() => {
    if (triggerZoomIn > 0) {
      map.zoomIn();
    }
  }, [triggerZoomIn, map]);

  useEffect(() => {
    if (triggerZoomOut > 0) {
      map.zoomOut();
    }
  }, [triggerZoomOut, map]);

  return null;
};

export const LiveRideMap: React.FC<LiveRideMapProps> = React.memo(({
  session,
  onManualRefresh,
  className = 'h-[460px] sm:h-[580px] w-full',
  isFamilyMode = false,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<MapTileLayerType>('dark');
  const [isAutoFollow, setIsAutoFollow] = useState(true);
  const [recenterCount, setRecenterCount] = useState(0);
  const [zoomInCount, setZoomInCount] = useState(0);
  const [zoomOutCount, setZoomOutCount] = useState(0);

  const hostParticipant = session.participants.find((p) => p.role === 'host') || session.participants[0];
  const currentPos = hostParticipant?.currentPosition || { lat: 37.7749, lng: -122.4194 };
  const mapCenter: [number, number] = [currentPos.lat, currentPos.lng];

  // Route path coordinates for Leaflet polyline
  const routePolylineCoords: [number, number][] = session.route.map((p) => [p.lat, p.lng]);
  const startPoint = session.route.length > 0 ? session.route[0] : null;

  const handleRecenter = useCallback(() => {
    setRecenterCount((c) => c + 1);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomInCount((c) => c + 1);
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomOutCount((c) => c + 1);
  }, []);

  const currentLayerConfig = MAP_LAYERS[selectedLayer] || MAP_LAYERS.dark;

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 ${className}`}>
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
        <div className="absolute top-4 left-4 z-[400] bg-red-600/95 text-white px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl shadow-red-600/50 animate-pulse border border-red-400">
          <ShieldAlert className="w-5 h-5 animate-spin" />
          <span>LIVE SOS BEACON BROADCASTING</span>
        </div>
      )}

      {isFamilyMode && session.status !== 'sos' && (
        <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md text-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Family Guardian Tracking</span>
        </div>
      )}

      {/* React Leaflet Map Canvas */}
      <MapContainer
        center={mapCenter}
        zoom={15}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution={currentLayerConfig.attribution}
          url={currentLayerConfig.url}
          maxZoom={currentLayerConfig.maxZoom}
        />

        <MapController
          center={mapCenter}
          isAutoFollow={isAutoFollow}
          triggerRecenter={recenterCount}
          triggerZoomIn={zoomInCount}
          triggerZoomOut={zoomOutCount}
        />

        {/* Starting Point Marker */}
        {startPoint && (
          <Marker position={[startPoint.lat, startPoint.lng]} icon={createStartMarkerIcon()}>
            <Popup className="custom-leaflet-popup">
              <div className="p-2 text-slate-900 font-sans">
                <p className="font-bold text-xs uppercase text-emerald-700">Ride Origin Point</p>
                <p className="text-[11px] text-slate-600">{formatTimestamp(startPoint.timestamp)}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Polyline Route Trail */}
        {routePolylineCoords.length > 1 && (
          <Polyline
            positions={routePolylineCoords}
            pathOptions={{
              color: session.status === 'sos' ? '#ef4444' : '#06b6d4',
              weight: 5,
              opacity: 0.85,
              lineCap: 'round',
              lineJoin: 'round',
              dashArray: session.status === 'paused' ? '6, 8' : undefined,
            }}
          />
        )}

        {/* Group Participants & Host Markers */}
        {session.participants.map((participant) => {
          const isHost = participant.role === 'host';
          const isSOS = participant.isSOS || session.status === 'sos';
          const pos: [number, number] = [
            participant.currentPosition.lat,
            participant.currentPosition.lng,
          ];

          return (
            <Marker
              key={participant.id}
              position={pos}
              icon={createRiderMarkerIcon(participant, isHost, isSOS)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-3 text-slate-900 font-sans min-w-[200px]">
                  <div className="flex items-center justify-between gap-2 border-b pb-1.5 mb-2">
                    <span className="font-black text-sm text-slate-900">
                      {participant.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isHost ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isHost ? 'RIDE LEADER' : 'WINGMAN'}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    🏍️ {participant.bikeModel}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mb-2.5">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{participant.speedKmh} km/h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{participant.batteryPct}%</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${participant.phone}`}
                    className="flex items-center justify-center gap-1.5 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-1.5 rounded-lg transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Rider</span>
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Bottom Telemetry Ticker */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-[400] bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 shadow-xl flex items-center justify-between sm:justify-start gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${session.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
            {session.status === 'active' ? 'Live Telemetry' : session.status}
          </span>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {session.participants.length} Active Riders
        </div>
        <div className="hidden sm:block text-xs text-cyan-400 font-mono">
          Heading: {currentPos.heading || 0}°
        </div>
      </div>
    </div>
  );
});

LiveRideMap.displayName = 'LiveRideMap';
