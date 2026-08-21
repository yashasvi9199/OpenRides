// * Zustand Auth store slice.
import { create } from 'zustand';
import { UserProfile, UserRole, EmergencyContact } from '../../shared/types';
import { generatePublicToken } from '../../shared/utils/formatters';

interface AuthState {
  currentRole: UserRole;
  user: UserProfile;
  soundEnabled: boolean;
  activeView: 'map' | 'group' | 'sos' | 'profile' | 'history';
  setRole: (role: UserRole) => void;
  setActiveView: (view: 'map' | 'group' | 'sos' | 'profile' | 'history') => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
  toggleSound: () => void;
}

const DEFAULT_RIDER_PROFILE: UserProfile = {
  id: 'usr_rider_01',
  name: 'New Rider',
  role: 'rider',
  phone: '',
  email: '',
  bikeModel: '',
  bikeNumber: '',
  bloodGroup: 'Unknown',
  allergies: [],
  medicalConditions: [],
  medications: [],
  emergencyContacts: [],
  medicalNotes: '',
  organDonor: false,
  insuranceCompany: '',
  insurancePolicyNumber: '',
  qrToken: 'openrides-' + Math.random().toString(36).substring(2, 9),
  avatarUrl: '',
};

const STORAGE_KEY = 'openrides_profile_v2';
const LEGACY_STORAGE_KEY = 'motoguard_profile_v2';

const loadSavedProfile = (): UserProfile => {
  if (typeof window === 'undefined') return DEFAULT_RIDER_PROFILE;
  try {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      saved = localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (saved) {
      return { ...DEFAULT_RIDER_PROFILE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.debug('Failed to parse saved auth profile', e);
  }
  return DEFAULT_RIDER_PROFILE;
};

export const useAuthStore = create<AuthState>((set) => ({
  currentRole: 'rider',
  user: loadSavedProfile(),
  soundEnabled: true,
  activeView: 'map',

  setRole: (role: UserRole) => {
    set({ currentRole: role });
  },

  setActiveView: (view) => {
    set({ activeView: view });
  },

  updateProfile: (updates) => {
    set((state) => {
      const updated = { ...state.user, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.debug('Error saving profile', e);
      }
      return { user: updated };
    });
  },

  addEmergencyContact: (contactData) => {
    set((state) => {
      const newContact: EmergencyContact = {
        ...contactData,
        id: 'cnt_' + Math.random().toString(36).substring(2, 9),
      };
      const updatedContacts = [...state.user.emergencyContacts, newContact];
      const updated = { ...state.user, emergencyContacts: updatedContacts };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return { user: updated };
    });
  },

  removeEmergencyContact: (id: string) => {
    set((state) => {
      const updatedContacts = state.user.emergencyContacts.filter((c) => c.id !== id);
      const updated = { ...state.user, emergencyContacts: updatedContacts };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return { user: updated };
    });
  },

  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },
}));
