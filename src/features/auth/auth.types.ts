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
