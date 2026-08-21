import { GeoPoint } from '../map/map.types';

export type RideStatus = 'idle' | 'active' | 'paused' | 'completed' | 'sos';

export interface RideParticipant {
  id: string;
  name: string;
  phone: string;
  bikeModel: string;
  avatar?: string;
  role: 'host' | 'member';
  status: 'pending' | 'approved' | 'rejected' | 'left';
  currentPosition: GeoPoint;
  speedKmh: number;
  batteryPct: number;
  lastPing: number;
  isSOS: boolean;
  distanceCoveredKm: number;
}

export interface PendingJoinRequest {
  id: string;
  riderId: string;
  riderName: string;
  bikeModel: string;
  phone: string;
  requestedAt: number;
  rideCode: string;
}

export interface RideSession {
  id: string;
  code: string;
  hostId: string;
  hostName: string;
  title: string;
  status: RideStatus;
  startTime: number;
  endTime?: number;
  route: GeoPoint[];
  participants: RideParticipant[];
  distanceKm: number;
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  currentSpeedKmh: number;
  batteryPct: number;
  currentLeanAngle: number;
  checkInDueAt?: number;
  lastUpdated: number;
}

export interface CrashAlert {
  id: string;
  timestamp: number;
  location: GeoPoint;
  impactGForce: number;
  speedBeforeCrashKmh: number;
  countdownRemaining: number;
  active: boolean;
}
