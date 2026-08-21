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
  name: 'Alex "Apex" Vance',
  role: 'rider',
  phone: '+1 (555) 234-8901',
  email: 'alex.rider@motoguard.io',
  bikeModel: 'Yamaha MT-09 SP (2024)',
  bikeNumber: 'CA • 9MOTO88',
  bloodGroup: 'O Positive (O+)',
  allergies: ['Penicillin', 'Sulfa Antibiotics'],
  medicalConditions: ['Asthma (Mild - Inhaler in Tank Bag)'],
  medications: ['Albuterol Inhaler (PRN)'],
  emergencyContacts: [
    {
      id: 'cnt_1',
      name: 'Sarah Vance',
      relationship: 'Spouse / Primary ICE',
      phone: '+1 (555) 890-1234',
      isPrimary: true,
    },
    {
      id: 'cnt_2',
      name: 'David Vance',
      relationship: 'Brother / Emergency Contact',
      phone: '+1 (555) 456-7890',
      isPrimary: false,
    },
    {
      id: 'cnt_3',
      name: 'Dr. Evelyn Martinez',
      relationship: 'Primary Physician',
      phone: '+1 (555) 321-6540',
      isPrimary: false,
    },
  ],
  medicalNotes: 'Helmet has Sena 50S communication module. EpiPen and Asthma inhaler stored in right tank bag zipper compartment.',
  organDonor: true,
  insuranceCompany: 'Progressive Motorcycle Safety & Health',
  insurancePolicyNumber: 'POL-99281-MT',
  qrToken: 'motoguard-alex-9921',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const STORAGE_KEY = 'motoguard_profile_v2';

const loadSavedProfile = (): UserProfile => {
  if (typeof window === 'undefined') return DEFAULT_RIDER_PROFILE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
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
