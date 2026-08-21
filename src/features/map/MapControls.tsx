// * Map Controls layout buttons.
import React, { useState } from 'react';
import {
  RotateCw,
  LocateFixed,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Compass,
} from 'lucide-react';
import { MapTileLayerType } from '../../shared/types';
import { formatTimestamp } from '../../shared/utils/formatters';

interface MapControlsProps {
  currentLayer: MapTileLayerType;
  onLayerChange: (layer: MapTileLayerType) => void;
  onRecenter: () => void;
  onManualRefresh: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  lastUpdated: number;
  isAutoFollow: boolean;
  onToggleAutoFollow: () => void;
  heading?: number;
}

export const MapControls: React.FC<MapControlsProps> = React.memo(({
  currentLayer,
  onLayerChange,
  onRecenter,
  onManualRefresh,
  onZoomIn,
  onZoomOut,
  lastUpdated,
  isAutoFollow,
  onToggleAutoFollow,
  heading = 0,
}) => {
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onManualRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2 pointer-events-auto">
      {/* Top Action Bar: Manual Refresh Button & Last Ping Badge */}
      <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="hidden sm:flex flex-col items-end px-2">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Data Store Sync</span>
          <span className="text-[11px] font-mono font-semibold text-cyan-400">
            {formatTimestamp(lastUpdated)}
          </span>
        </div>

        {/* Primary Manual Refresh Button */}
        <button
          onClick={handleRefreshClick}
          className={`flex items-center gap-1.5 px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer ${
            isRefreshing ? 'opacity-80' : ''
          }`}
          title="Manual Refresh: Fetch latest coordinates from backend"
          aria-label="Manual Refresh Coordinates"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Control Buttons Cluster */}
      <div className="flex flex-col bg-slate-950/90 backdrop-blur-md rounded-2xl border border-slate-800 p-1.5 shadow-xl gap-1">
        {/* Recenter & Follow Toggle */}
        <button
          onClick={() => {
            onRecenter();
            onToggleAutoFollow();
          }}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
            isAutoFollow
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title={isAutoFollow ? 'Auto-centering Enabled' : 'Click to Recenter on Rider'}
          aria-label="Recenter on Rider"
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        {/* Layer Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              showLayerMenu
                ? 'bg-slate-800 text-cyan-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Switch Map Tiles"
            aria-label="Switch Map Layer"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Layer Flyout Menu */}
          {showLayerMenu && (
            <div className="absolute right-12 top-0 bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl w-44 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Map Tiles (100% Free)
              </span>
              <button
                onClick={() => {
                  onLayerChange('dark');
                  setShowLayerMenu(false);
                }}
                className={`text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                  currentLayer === 'dark'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Tactical Dark</span>
                {currentLayer === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </button>
              <button
                onClick={() => {
                  onLayerChange('osm');
                  setShowLayerMenu(false);
                }}
                className={`text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                  currentLayer === 'osm'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>OpenStreetMap</span>
                {currentLayer === 'osm' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </button>
              <button
                onClick={() => {
                  onLayerChange('terrain');
                  setShowLayerMenu(false);
                }}
                className={`text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                  currentLayer === 'terrain'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Topo Terrain</span>
                {currentLayer === 'terrain' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Compass Heading Indicator */}
        <div
          className="p-2.5 rounded-xl text-slate-400 flex items-center justify-center pointer-events-none"
          title={`Compass Heading: ${heading}°`}
        >
          <Compass
            className="w-4 h-4 text-cyan-400 transition-transform duration-300"
            style={{ transform: `rotate(${heading}deg)` }}
          />
        </div>

        {/* Zoom Controls */}
        <div className="h-px bg-slate-800 my-0.5" />
        <button
          onClick={onZoomIn}
          className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
});

MapControls.displayName = 'MapControls';
