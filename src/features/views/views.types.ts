import { UserProfile, UserRole } from '../auth/auth.types';
import { RideSession, PendingJoinRequest, CrashAlert } from '../ride/ride.types';

export interface CommonViewProps {
  user: UserProfile;
  currentRole: UserRole;
  soundEnabled: boolean;
  activeView: string;
  currentSession: RideSession;
  pendingRequests: PendingJoinRequest[];
  crashAlert: CrashAlert | null;
  history: RideSession[];
  
  isGroupModalOpen: boolean;
  setIsGroupModalOpen: (open: boolean) => void;
  isQRModalOpen: boolean;
  setIsQRModalOpen: (open: boolean) => void;
  isHistoryModalOpen: boolean;
  setIsHistoryModalOpen: (open: boolean) => void;
  setIsPublicEmergencyViewActive: (active: boolean) => void;

  handleRoleChange: (newRole: UserRole) => void;
  handleManualRefresh: () => void;
  toggleSound: () => void;
  triggerSOS: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addEmergencyContact: (contact: any) => void;
  removeEmergencyContact: (id: string) => void;

  startRide: (title: string) => void;
  pauseRide: () => void;
  resumeRide: () => void;
  stopRide: () => void;
  joinGroupWithCode: (code: string) => void;
  approveJoinRequest: (id: string) => void;
  rejectJoinRequest: (id: string) => void;
  createJoinRequestSimulation: () => void;
  dismissSOS: () => void;
  triggerSimulatedCrash: () => void;
  dismissCrashAlert: () => void;
  confirmCheckIn: () => void;
}
