// * Zustand Ride tracking store slice.
import { create } from 'zustand';
import {
  RideSession,
  RideParticipant,
  GeoPoint,
  PendingJoinRequest,
  CrashAlert,
} from '../../shared/types';
import {
  DEFAULT_COORDINATES,
  simulateNextWaypoint,
  calculateDistanceKm,
} from '../../shared/utils/geo';
import { generateSecretGroupCode } from '../../shared/utils/formatters';
import {
  requestScreenWakeLock,
  releaseScreenWakeLock,
  triggerSafeHaptic,
  getBatteryLevelSafe,
} from '../../shared/utils/capacitor';
import {
  playBeep,
  playSuccessChime,
  startEmergencySiren,
  stopEmergencySiren,
} from '../../shared/utils/audio';

interface RideHistoryItem {
  id: string;
  title: string;
  date: number;
  durationSec: number;
  distanceKm: number;
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  participantCount: number;
}

interface RideState {
  currentSession: RideSession;
  pendingRequests: PendingJoinRequest[];
  crashAlert: CrashAlert | null;
  history: RideHistoryItem[];
  isTracking: boolean;
  manualRefreshCounter: number;
  isSimulatingTelemetry: boolean;
  
  // Actions
  startRide: (title?: string) => Promise<void>;
  pauseRide: () => void;
  resumeRide: () => void;
  stopRide: () => void;
  updateCurrentPosition: (pos: GeoPoint) => void;
  joinGroupWithCode: (code: string, riderInfo: { name: string; phone: string; bikeModel: string }) => boolean;
  approveJoinRequest: (requestId: string) => void;
  rejectJoinRequest: (requestId: string) => void;
  createJoinRequestSimulation: (riderName: string, bikeModel: string) => void;
  manualRefreshPositions: () => void;
  triggerSOS: () => void;
  dismissSOS: () => void;
  triggerSimulatedCrash: () => void;
  dismissCrashAlert: () => void;
  confirmCheckIn: () => void;
  setSimulationMode: (active: boolean) => void;
}

// Initial default session
const createInitialSession = (): RideSession => ({
  id: 'ride_' + Math.random().toString(36).substring(2, 9),
  code: '748291',
  hostId: 'usr_rider_01',
  hostName: 'Alex "Apex" Vance',
  title: 'Skyline Ridge & Coastline Pass',
  status: 'idle',
  startTime: 0,
  route: [DEFAULT_COORDINATES],
  distanceKm: 0,
  maxSpeedKmh: 0,
  avgSpeedKmh: 0,
  currentSpeedKmh: 0,
  batteryPct: 94,
  currentLeanAngle: 0,
  checkInDueAt: undefined,
  lastUpdated: Date.now(),
  participants: [
    {
      id: 'usr_rider_01',
      name: 'Alex Vance (You)',
      phone: '+1 (555) 234-8901',
      bikeModel: 'Yamaha MT-09 SP',
      role: 'host',
      status: 'approved',
      currentPosition: { ...DEFAULT_COORDINATES },
      speedKmh: 0,
      batteryPct: 94,
      lastPing: Date.now(),
      isSOS: false,
      distanceCoveredKm: 0,
    },
    {
      id: 'usr_rider_02',
      name: 'Maya Chen',
      phone: '+1 (555) 912-3847',
      bikeModel: 'Ducati Panigale V2',
      role: 'member',
      status: 'approved',
      currentPosition: {
        lat: DEFAULT_COORDINATES.lat + 0.0035,
        lng: DEFAULT_COORDINATES.lng + 0.0028,
        heading: 142,
        speed: 52,
        timestamp: Date.now(),
      },
      speedKmh: 52,
      batteryPct: 88,
      lastPing: Date.now(),
      isSOS: false,
      distanceCoveredKm: 12.4,
    },
    {
      id: 'usr_rider_03',
      name: 'Liam Ross',
      phone: '+1 (555) 837-1920',
      bikeModel: 'KTM 890 Adventure R',
      role: 'member',
      status: 'approved',
      currentPosition: {
        lat: DEFAULT_COORDINATES.lat - 0.0042,
        lng: DEFAULT_COORDINATES.lng - 0.0031,
        heading: 140,
        speed: 47,
        timestamp: Date.now(),
      },
      speedKmh: 47,
      batteryPct: 76,
      lastPing: Date.now(),
      isSOS: false,
      distanceCoveredKm: 11.9,
    },
  ],
});

const INITIAL_HISTORY: RideHistoryItem[] = [
  {
    id: 'hist_1',
    title: 'Pacific Highway Sunset Run',
    date: Date.now() - 86400000 * 2,
    durationSec: 5420,
    distanceKm: 78.4,
    maxSpeedKmh: 104,
    avgSpeedKmh: 52.3,
    participantCount: 4,
  },
  {
    id: 'hist_2',
    title: 'Redwood Canyon Twisties',
    date: Date.now() - 86400000 * 5,
    durationSec: 4200,
    distanceKm: 54.1,
    maxSpeedKmh: 92,
    avgSpeedKmh: 46.8,
    participantCount: 3,
  },
];

let telemetryInterval: any = null;
let crashCountdownInterval: any = null;
let geoWatchId: number | null = null;

export const useRideStore = create<RideState>((set, get) => ({
  currentSession: createInitialSession(),
  pendingRequests: [
    {
      id: 'req_init_1',
      riderId: 'usr_rider_04',
      riderName: 'Elena Rostova',
      bikeModel: 'BMW S1000RR M-Package',
      phone: '+1 (555) 749-0012',
      requestedAt: Date.now() - 45000,
      rideCode: '748291',
    },
  ],
  crashAlert: null,
  history: INITIAL_HISTORY,
  isTracking: false,
  manualRefreshCounter: 0,
  isSimulatingTelemetry: true,

  startRide: async (title = 'Live Group Ride') => {
    const battery = await getBatteryLevelSafe();
    await requestScreenWakeLock();
    playSuccessChime();
    triggerSafeHaptic([100, 50, 100]);

    const newCode = generateSecretGroupCode();
    const startTime = Date.now();

    set((state) => {
      const updatedParticipants = state.currentSession.participants.map((p) => {
        if (p.role === 'host') {
          return {
            ...p,
            batteryPct: battery,
            currentPosition: { ...p.currentPosition, timestamp: startTime },
          };
        }
        return p;
      });

      return {
        isTracking: true,
        currentSession: {
          ...state.currentSession,
          id: 'ride_' + Math.random().toString(36).substring(2, 9),
          code: newCode,
          title,
          status: 'active',
          startTime,
          distanceKm: 0,
          maxSpeedKmh: 0,
          avgSpeedKmh: 0,
          currentSpeedKmh: 35,
          batteryPct: battery,
          checkInDueAt: startTime + 30 * 60 * 1000, // 30 min safety check-in
          participants: updatedParticipants,
          lastUpdated: startTime,
        },
      };
    });

    // Start Real GPS Geolocation Watcher if available
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        geoWatchId = navigator.geolocation.watchPosition(
          (pos) => {
            const currentSpeedKmh = pos.coords.speed ? pos.coords.speed * 3.6 : 45;
            get().updateCurrentPosition({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              altitude: pos.coords.altitude || 25,
              heading: pos.coords.heading || 135,
              speed: currentSpeedKmh,
              timestamp: Date.now(),
            });
          },
          (err) => {
            console.debug('Geolocation watch warning (using simulation):', err.message);
          },
          { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
        );
      } catch (e) {
        console.debug('Geolocation initial setup exception', e);
      }
    }

    // Start dynamic telemetry simulation ticker
    if (telemetryInterval) clearInterval(telemetryInterval);
    telemetryInterval = setInterval(() => {
      const state = get();
      if (state.currentSession.status !== 'active') return;

      const hostParticipant = state.currentSession.participants.find((p) => p.role === 'host');
      const lastPoint = hostParticipant?.currentPosition || DEFAULT_COORDINATES;

      // Realistic speed fluctuation (e.g. 40 - 75 km/h)
      const baseSpeed = 48 + (Math.sin(Date.now() / 8000) * 18) + (Math.random() - 0.5) * 6;
      const targetSpeed = Math.max(12, Math.min(110, baseSpeed));
      const nextPoint = simulateNextWaypoint(lastPoint, targetSpeed, 2, 0.08);

      const addedDist = calculateDistanceKm(
        lastPoint.lat,
        lastPoint.lng,
        nextPoint.lat,
        nextPoint.lng
      );
      const newTotalDist = state.currentSession.distanceKm + addedDist;
      const newMaxSpeed = Math.max(state.currentSession.maxSpeedKmh, targetSpeed);

      // Simulate group members moving alongside
      const updatedMembers = state.currentSession.participants.map((m) => {
        if (m.role === 'host') {
          return {
            ...m,
            currentPosition: nextPoint,
            speedKmh: Math.round(targetSpeed),
            distanceCoveredKm: parseFloat(newTotalDist.toFixed(2)),
            lastPing: Date.now(),
          };
        }
        // Move members slightly
        const memberNext = simulateNextWaypoint(
          m.currentPosition,
          targetSpeed + (Math.random() - 0.5) * 8,
          2,
          0.05
        );
        return {
          ...m,
          currentPosition: memberNext,
          speedKmh: Math.round(targetSpeed + (Math.random() - 0.5) * 6),
          distanceCoveredKm: parseFloat((m.distanceCoveredKm + addedDist).toFixed(2)),
          lastPing: Date.now(),
        };
      });

      // Lean angle oscillation (-28 deg to +28 deg)
      const leanAngle = Math.round(Math.sin(Date.now() / 3500) * 26);

      set((s) => ({
        currentSession: {
          ...s.currentSession,
          currentSpeedKmh: Math.round(targetSpeed),
          maxSpeedKmh: Math.round(newMaxSpeed),
          distanceKm: parseFloat(newTotalDist.toFixed(2)),
          currentLeanAngle: leanAngle,
          route: [...s.currentSession.route.slice(-200), nextPoint],
          participants: updatedMembers,
          lastUpdated: Date.now(),
        },
      }));
    }, 2000);
  },

  pauseRide: () => {
    triggerSafeHaptic(80);
    set((state) => ({
      currentSession: {
        ...state.currentSession,
        status: 'paused',
        currentSpeedKmh: 0,
      },
    }));
  },

  resumeRide: () => {
    triggerSafeHaptic(80);
    set((state) => ({
      currentSession: {
        ...state.currentSession,
        status: 'active',
      },
    }));
  },

  stopRide: () => {
    releaseScreenWakeLock();
    if (telemetryInterval) {
      clearInterval(telemetryInterval);
      telemetryInterval = null;
    }
    if (geoWatchId !== null && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(geoWatchId);
      geoWatchId = null;
    }

    const { currentSession, history } = get();
    if (currentSession.startTime > 0 && currentSession.distanceKm > 0.05) {
      const durationSec = Math.round((Date.now() - currentSession.startTime) / 1000);
      const avgSpeed = durationSec > 0 ? (currentSession.distanceKm / (durationSec / 3600)) : 0;
      const historyEntry: RideHistoryItem = {
        id: 'hist_' + Date.now(),
        title: currentSession.title || 'Group Tour',
        date: Date.now(),
        durationSec,
        distanceKm: currentSession.distanceKm,
        maxSpeedKmh: currentSession.maxSpeedKmh,
        avgSpeedKmh: parseFloat(avgSpeed.toFixed(1)),
        participantCount: currentSession.participants.length,
      };

      set({
        history: [historyEntry, ...history],
        isTracking: false,
        currentSession: {
          ...currentSession,
          status: 'completed',
          endTime: Date.now(),
          currentSpeedKmh: 0,
        },
      });
    } else {
      set({
        isTracking: false,
        currentSession: {
          ...currentSession,
          status: 'idle',
          currentSpeedKmh: 0,
        },
      });
    }
  },

  updateCurrentPosition: (pos: GeoPoint) => {
    set((state) => {
      const currentRoute = state.currentSession.route;
      const lastPoint = currentRoute[currentRoute.length - 1];
      let addedDist = 0;
      if (lastPoint) {
        addedDist = calculateDistanceKm(lastPoint.lat, lastPoint.lng, pos.lat, pos.lng);
      }

      const updatedParticipants = state.currentSession.participants.map((p) => {
        if (p.role === 'host') {
          return {
            ...p,
            currentPosition: pos,
            speedKmh: Math.round(pos.speed || 0),
            lastPing: Date.now(),
          };
        }
        return p;
      });

      return {
        currentSession: {
          ...state.currentSession,
          route: [...currentRoute.slice(-300), pos],
          distanceKm: parseFloat((state.currentSession.distanceKm + addedDist).toFixed(2)),
          currentSpeedKmh: Math.round(pos.speed || 0),
          participants: updatedParticipants,
          lastUpdated: Date.now(),
        },
      };
    });
  },

  joinGroupWithCode: (code: string, riderInfo) => {
    const state = get();
    // Validate 6-digit code format
    const cleanedCode = code.trim().replace(/\s+/g, '');
    if (cleanedCode.length !== 6) return false;

    // Create a pending join request on the host state
    const newRequest: PendingJoinRequest = {
      id: 'req_' + Math.random().toString(36).substring(2, 9),
      riderId: 'usr_' + Math.random().toString(36).substring(2, 8),
      riderName: riderInfo.name || 'Fellow Rider',
      bikeModel: riderInfo.bikeModel || 'Street Motorcycle',
      phone: riderInfo.phone || '+1 (555) 000-0000',
      requestedAt: Date.now(),
      rideCode: cleanedCode,
    };

    set((s) => ({
      pendingRequests: [...s.pendingRequests, newRequest],
    }));

    playBeep(700, 150, 'sine');
    return true;
  },

  approveJoinRequest: (requestId: string) => {
    const state = get();
    const req = state.pendingRequests.find((r) => r.id === requestId);
    if (!req) return;

    playSuccessChime();
    triggerSafeHaptic([100, 80, 150]);

    // Calculate a nearby spawn position
    const hostPos = state.currentSession.participants[0]?.currentPosition || DEFAULT_COORDINATES;
    const offsetLat = (Math.random() - 0.5) * 0.005;
    const offsetLng = (Math.random() - 0.5) * 0.005;

    const newParticipant: RideParticipant = {
      id: req.riderId,
      name: req.riderName,
      phone: req.phone,
      bikeModel: req.bikeModel,
      role: 'member',
      status: 'approved',
      currentPosition: {
        lat: hostPos.lat + offsetLat,
        lng: hostPos.lng + offsetLng,
        heading: Math.round(Math.random() * 360),
        speed: state.currentSession.currentSpeedKmh || 45,
        timestamp: Date.now(),
      },
      speedKmh: state.currentSession.currentSpeedKmh || 45,
      batteryPct: Math.floor(75 + Math.random() * 22),
      lastPing: Date.now(),
      isSOS: false,
      distanceCoveredKm: state.currentSession.distanceKm,
    };

    set((s) => ({
      pendingRequests: s.pendingRequests.filter((r) => r.id !== requestId),
      currentSession: {
        ...s.currentSession,
        participants: [...s.currentSession.participants, newParticipant],
      },
    }));
  },

  rejectJoinRequest: (requestId: string) => {
    triggerSafeHaptic(80);
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((r) => r.id !== requestId),
    }));
  },

  createJoinRequestSimulation: (riderName: string, bikeModel: string) => {
    const { currentSession } = get();
    const newReq: PendingJoinRequest = {
      id: 'req_' + Math.random().toString(36).substring(2, 9),
      riderId: 'usr_sim_' + Math.random().toString(36).substring(2, 7),
      riderName,
      bikeModel,
      phone: '+1 (555) ' + Math.floor(100 + Math.random() * 899) + '-' + Math.floor(1000 + Math.random() * 8999),
      requestedAt: Date.now(),
      rideCode: currentSession.code,
    };

    playBeep(880, 200, 'triangle');
    set((state) => ({
      pendingRequests: [...state.pendingRequests, newReq],
    }));
  },

  manualRefreshPositions: () => {
    triggerSafeHaptic(50);
    playBeep(1200, 70, 'sine');
    
    set((state) => {
      // Refresh participant timestamps and slightly adjust points to indicate live sync
      const refreshed = state.currentSession.participants.map((p) => ({
        ...p,
        lastPing: Date.now(),
        batteryPct: Math.max(10, p.batteryPct - (Math.random() < 0.2 ? 1 : 0)),
      }));

      return {
        manualRefreshCounter: state.manualRefreshCounter + 1,
        currentSession: {
          ...state.currentSession,
          participants: refreshed,
          lastUpdated: Date.now(),
        },
      };
    });
  },

  triggerSOS: () => {
    startEmergencySiren();
    triggerSafeHaptic([500, 200, 500, 200, 500]);
    set((state) => ({
      currentSession: {
        ...state.currentSession,
        status: 'sos',
        participants: state.currentSession.participants.map((p) =>
          p.role === 'host' ? { ...p, isSOS: true } : p
        ),
      },
    }));
  },

  dismissSOS: () => {
    stopEmergencySiren();
    triggerSafeHaptic(100);
    set((state) => ({
      currentSession: {
        ...state.currentSession,
        status: 'active',
        participants: state.currentSession.participants.map((p) =>
          p.role === 'host' ? { ...p, isSOS: false } : p
        ),
      },
    }));
  },

  triggerSimulatedCrash: () => {
    const { currentSession } = get();
    const hostPos = currentSession.participants[0]?.currentPosition || DEFAULT_COORDINATES;

    startEmergencySiren();
    triggerSafeHaptic([400, 150, 400, 150, 400]);

    const newCrashAlert: CrashAlert = {
      id: 'crash_' + Date.now(),
      timestamp: Date.now(),
      location: hostPos,
      impactGForce: 3.8,
      speedBeforeCrashKmh: currentSession.currentSpeedKmh || 62,
      countdownRemaining: 10,
      active: true,
    };

    set({ crashAlert: newCrashAlert });

    if (crashCountdownInterval) clearInterval(crashCountdownInterval);
    crashCountdownInterval = setInterval(() => {
      const { crashAlert } = get();
      if (!crashAlert || !crashAlert.active) {
        clearInterval(crashCountdownInterval);
        return;
      }

      if (crashAlert.countdownRemaining <= 1) {
        clearInterval(crashCountdownInterval);
        get().triggerSOS();
        set((s) => ({
          crashAlert: s.crashAlert ? { ...s.crashAlert, countdownRemaining: 0 } : null,
        }));
      } else {
        playBeep(980, 100, 'sawtooth');
        set((s) => ({
          crashAlert: s.crashAlert
            ? { ...s.crashAlert, countdownRemaining: s.crashAlert.countdownRemaining - 1 }
            : null,
        }));
      }
    }, 1000);
  },

  dismissCrashAlert: () => {
    stopEmergencySiren();
    triggerSafeHaptic(80);
    if (crashCountdownInterval) {
      clearInterval(crashCountdownInterval);
      crashCountdownInterval = null;
    }
    set({ crashAlert: null });
  },

  confirmCheckIn: () => {
    playSuccessChime();
    triggerSafeHaptic(100);
    set((state) => ({
      currentSession: {
        ...state.currentSession,
        checkInDueAt: Date.now() + 30 * 60 * 1000,
      },
    }));
  },

  setSimulationMode: (active: boolean) => {
    set({ isSimulatingTelemetry: active });
  },
}));
