// * Medical profile form editor interface.
import React, { useState } from 'react';
import { UserProfile, EmergencyContact } from '../../shared/types';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import {
  Heart,
  Plus,
  Trash2,
  Shield,
  Phone,
  User,
  AlertCircle,
  FileText,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../shared/components/Toast';

interface MedicalProfileEditorProps {
  user: UserProfile;
  onSave: (updates: Partial<UserProfile>) => void;
  onAddContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  onRemoveContact: (id: string) => void;
}

const BLOOD_GROUPS = [
  'O Positive (O+)',
  'O Negative (O-)',
  'A Positive (A+)',
  'A Negative (A-)',
  'B Positive (B+)',
  'B Negative (B-)',
  'AB Positive (AB+)',
  'AB Negative (AB-)',
];

export const MedicalProfileEditor: React.FC<MedicalProfileEditorProps> = ({
  user,
  onSave,
  onAddContact,
  onRemoveContact,
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    bikeModel: user.bikeModel,
    bikeNumber: user.bikeNumber,
    bloodGroup: user.bloodGroup,
    medicalNotes: user.medicalNotes,
    organDonor: user.organDonor,
    insuranceCompany: user.insuranceCompany,
    insurancePolicyNumber: user.insurancePolicyNumber,
  });

  const [allergiesList, setAllergiesList] = useState<string[]>(user.allergies);
  const [newAllergy, setNewAllergy] = useState('');

  const [conditionsList, setConditionsList] = useState<string[]>(user.medicalConditions);
  const [newCondition, setNewCondition] = useState('');

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('Family / ICE');
  const [isPrimaryContact, setIsPrimaryContact] = useState(false);

  const { success, error } = useToast();

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      allergies: allergiesList,
      medicalConditions: conditionsList,
    });
    success('Profile Updated', 'Emergency medical information saved successfully.');
  };

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    if (allergiesList.includes(newAllergy.trim())) return;
    setAllergiesList([...allergiesList, newAllergy.trim()]);
    setNewAllergy('');
  };

  const handleRemoveAllergy = (item: string) => {
    setAllergiesList(allergiesList.filter((a) => a !== item));
  };

  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    setConditionsList([...conditionsList, newCondition.trim()]);
    setNewCondition('');
  };

  const handleRemoveCondition = (item: string) => {
    setConditionsList(conditionsList.filter((c) => c !== item));
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) {
      error('Missing Details', 'Please provide a contact name and phone number.');
      return;
    }

    onAddContact({
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRel.trim(),
      isPrimary: isPrimaryContact,
    });

    setNewContactName('');
    setNewContactPhone('');
    setIsPrimaryContact(false);
    success('Contact Added', 'New emergency contact saved.');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-red-50 border border-red-200 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg">
            <Heart className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Rider Medical Profile & I.C.E.</h2>
            <p className="text-xs text-slate-500">
              Information displayed when emergency responders scan your helmet QR code
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSaveAll}
          className="text-white"
        >
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSaveAll} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rider & Motorcycle Details */}
        <Card className="flex flex-col gap-4 bg-white border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
            Rider & Vehicle Information
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Rider Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Motorcycle Model</label>
              <input
                type="text"
                value={formData.bikeModel}
                onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">License Plate / ID</label>
              <input
                type="text"
                value={formData.bikeNumber}
                onChange={(e) => setFormData({ ...formData, bikeNumber: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
            <select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:border-cyan-500 focus:outline-none font-bold"
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg} className="text-slate-800 bg-white">
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="organDonor"
              checked={formData.organDonor}
              onChange={(e) => setFormData({ ...formData, organDonor: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 bg-white border-slate-300 focus:ring-cyan-400"
            />
            <label htmlFor="organDonor" className="text-xs font-semibold text-slate-800 cursor-pointer">
              I am an Organ Donor (Authorized on Driver License)
            </label>
          </div>
        </Card>

        {/* Medical & Paramedic Notes */}
        <Card className="flex flex-col gap-4 bg-white border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
            Allergies & Medical Alerts
          </h3>

          {/* Allergies tag list */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Known Drug & Food Allergies
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {allergiesList.map((alg) => (
                <span
                  key={alg}
                  className="bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span>{alg}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(alg)}
                    className="text-red-500 hover:text-red-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="e.g. Penicillin, Latex, NSAIDs"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:border-cyan-500 focus:outline-none"
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddAllergy}>
                Add
              </Button>
            </div>
          </div>

          {/* Medical Conditions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Conditions / Daily Medications
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {conditionsList.map((cond) => (
                <span
                  key={cond}
                  className="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span>{cond}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(cond)}
                    className="text-slate-500 hover:text-slate-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="e.g. Asthma (Inhaler in tank bag), Diabetes"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:border-cyan-500 focus:outline-none"
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddCondition}>
                Add
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instructions for First Responders & Paramedics
            </label>
            <textarea
              rows={2}
              value={formData.medicalNotes}
              onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
              placeholder="e.g. Do not remove helmet unless airway compromised. Inhaler in right pocket."
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:border-cyan-500 focus:outline-none leading-relaxed"
            />
          </div>
        </Card>

        {/* Emergency ICE Contacts List */}
        <Card className="md:col-span-2 flex flex-col gap-4 bg-white border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-600" />
              <span>In Case of Emergency (I.C.E.) Contacts</span>
            </h3>
            <span className="text-xs text-slate-500">
              {user.emergencyContacts.length} Contacts Configured
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {user.emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{contact.name}</span>
                    {contact.isPrimary && (
                      <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded">
                        PRIMARY ICE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{contact.relationship}</p>
                  <p className="text-xs font-mono font-bold text-cyan-700 mt-1">{contact.phone}</p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200">
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Test Dial</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onRemoveContact(contact.id)}
                    className="text-slate-500 hover:text-red-500 p-1 cursor-pointer transition-colors"
                    title="Remove Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Contact Sub-form */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
            <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
              Add New Emergency Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="Full Name (e.g. Sarah Vance)"
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-cyan-500 focus:outline-none"
              />
              <input
                type="text"
                value={newContactRel}
                onChange={(e) => setNewContactRel(e.target.value)}
                placeholder="Relationship (e.g. Spouse / Parent)"
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-cyan-500 focus:outline-none"
              />
              <input
                type="tel"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                placeholder="Phone (e.g. +1 555-890-1234)"
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
            <div className="flex items-center justify-between mt-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrimaryContact}
                  onChange={(e) => setIsPrimaryContact(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-red-500"
                />
                <span>Set as Primary Emergency Contact</span>
              </label>

              <Button
                type="button"
                size="sm"
                variant="secondary"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={handleAddContactSubmit}
              >
                Add Contact
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};
