// * Custom MapLibre markers element generators.
import { RideParticipant } from '../../shared/types';

/**
 * Creates custom animated HTML marker element for the active current rider
 */
export const createRiderMarkerElement = (
  participant: RideParticipant,
  isHost: boolean,
  isSOS: boolean
): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'custom-rider-marker';

  const borderColor = isSOS
    ? 'border-red-500 bg-red-600 shadow-red-500/60'
    : isHost
    ? 'border-cyan-400 bg-cyan-500 shadow-cyan-500/60'
    : 'border-emerald-400 bg-emerald-500 shadow-emerald-500/60';

  const pulseColor = isSOS
    ? 'bg-red-500/50'
    : isHost
    ? 'bg-cyan-500/40'
    : 'bg-emerald-500/40';

  const headingRotation = participant.currentPosition.heading || 0;

  el.innerHTML = `
    <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
      <!-- Radar Pulse Ring -->
      <div class="radar-ping ${pulseColor} w-12 h-12"></div>
      
      <!-- Direction Heading Arrow -->
      <div 
        style="transform: rotate(${headingRotation}deg);" 
        class="absolute w-10 h-10 flex items-start justify-center pointer-events-none transition-transform duration-300"
      >
        <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px] border-b-cyan-300 -translate-y-1.5 drop-shadow"></div>
      </div>

      <!-- Main Marker Core -->
      <div class="w-8 h-8 rounded-full border-2 ${borderColor} flex items-center justify-center text-slate-950 font-bold shadow-lg z-10">
        ${
          isSOS
            ? '<span class="text-xs font-black text-white animate-bounce">SOS</span>'
            : `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`
        }
      </div>

      <!-- Rider Label Pill -->
      <div class="absolute top-8.5 whitespace-nowrap bg-slate-950/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700 shadow-md backdrop-blur-sm pointer-events-none flex items-center gap-1">
        <span>${participant.name.split(' ')[0]}</span>
        <span class="text-cyan-400 font-mono">${participant.speedKmh}kph</span>
      </div>
    </div>
  `;

  return el;
};

/**
 * Creates custom marker element for the ride Starting Point
 */
export const createStartMarkerElement = (): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'custom-start-marker';

  el.innerHTML = `
    <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
      <div class="w-7 h-7 rounded-full bg-emerald-500/90 border-2 border-white flex items-center justify-center text-white shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
      </div>
      <div class="absolute top-7 bg-emerald-950/90 text-emerald-200 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-700 shadow pointer-events-none">
        START
      </div>
    </div>
  `;

  return el;
};

/**
 * Creates custom blue dot HTML marker element representing the user's current location
 */
export const createBlueDotMarkerElement = (): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'custom-blue-dot-marker';

  el.innerHTML = `
    <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
      <!-- Radar Pulse Ring -->
      <div class="absolute radar-ping bg-blue-500/40 w-8 h-8 rounded-full"></div>
      <!-- Blue Dot Core -->
      <div class="absolute w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white shadow-md shadow-blue-500/50"></div>
    </div>
  `;

  return el;
};

