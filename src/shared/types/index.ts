export type UserRole = 'rider' | 'family' | 'guest';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email?: string;
  bikeModel: string;
  bikeNumber: string;
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
  medications: string[];
  emergencyContacts: EmergencyContact[];
  medicalNotes: string;
  organDonor: boolean;
  insuranceCompany: string;
  insurancePolicyNumber: string;
  qrToken: string; // Unique public token for /sos/{token}
  avatarUrl?: string;
  connectedFamilyIds?: string[];
}

export type RideStatus = 'idle' | 'active' | 'paused' | 'completed' | 'sos';

export interface GeoPoint {
  lat: number;
  lng: number;
  altitude?: number;
  heading?: number;
  speed?: number; // m/s or km/h depending on source
  timestamp: number;
}

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
  code: string; // 6-digit secret code e.g. "849201"
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
  checkInDueAt?: number; // Dead man's safety timer
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

export type MapTileLayerType = 'osm' | 'dark' | 'satellite' | 'terrain';
