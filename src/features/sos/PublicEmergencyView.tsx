// * Unauthenticated public emergency profile display.
import React from 'react';
import { UserProfile } from '../../shared/types';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import {
  Heart,
  Phone,
  AlertTriangle,
  Shield,
  FileText,
  MapPin,
  Share2,
  ArrowLeft,
  CheckCircle,
  PhoneCall,
  Activity,
} from 'lucide-react';

interface PublicEmergencyViewProps {
  user: UserProfile;
  onBackToApp: () => void;
}

export const PublicEmergencyView: React.FC<PublicEmergencyViewProps> = ({
  user,
  onBackToApp,
}) => {
  const primaryContact = user.emergencyContacts.find((c) => c.isPrimary) || user.emergencyContacts[0];

  const handleShareEmergencyLocation = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Emergency Dispatch for Rider ${user.name}`,
          text: `Emergency incident involving rider ${user.name} (Blood: ${user.bloodGroup}, Bike: ${user.bikeModel} ${user.bikeNumber}). Primary ICE Contact: ${primaryContact?.name} (${primaryContact?.phone}).`,
        })
        .catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col items-center">
      {/* Top Emergency Status Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4">
        <button
          onClick={onBackToApp}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Emergency View</span>
        </button>
        <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest bg-red-950/80 px-2.5 py-1 rounded-full border border-red-800">
          PUBLIC I.C.E. RESCUE PORTAL
        </span>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        {/* Main Red Alert Card */}
        <div className="bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 border-2 border-red-500 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-red-950/80 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-red-800/60 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-red-600 text-white font-black text-[10px] tracking-widest uppercase px-2 py-0.5 rounded">
                  FIRST RESPONDER MEDICAL CARD
                </span>
                {user.organDonor && (
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded">
                    ORGAN DONOR
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
              <p className="text-xs text-cyan-300 font-semibold mt-0.5">
                🏍️ {user.bikeModel} • <span className="font-mono">{user.bikeNumber}</span>
              </p>
            </div>

            {/* Blood Type Big Badge */}
            <div className="bg-red-600 text-white p-3 sm:p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center shrink-0 border-2 border-white/20">
              <span className="text-[10px] font-black uppercase tracking-wider">BLOOD TYPE</span>
              <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight">
                {user.bloodGroup.split(' ')[0] || 'O+'}
              </span>
            </div>
          </div>

          {/* Primary Quick Emergency Call Button */}
          {primaryContact && (
            <div className="mt-4">
              <a
                href={`tel:${primaryContact.phone}`}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-red-600/40 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                <PhoneCall className="w-6 h-6 animate-bounce" />
                <span>CALL PRIMARY ICE ({primaryContact.name.toUpperCase()})</span>
              </a>
            </div>
          )}
        </div>

        {/* Critical Allergies Box */}
        {user.allergies.length > 0 && (
          <div className="bg-amber-950/40 border-2 border-amber-500/70 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-black text-sm text-amber-300 uppercase tracking-wide">
                CRITICAL ALLERGY ALERT
              </h3>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                Rider has reported severe reaction to:{' '}
                <strong className="text-amber-200 underline font-bold">
                  {user.allergies.join(', ')}
                </strong>
                . Administer alternative medications.
              </p>
            </div>
          </div>
        )}

        {/* Medical Conditions & Paramedic Notes */}
        <Card className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Medical Conditions & Treatment Notes</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 font-bold block uppercase text-[10px]">
                Chronic Conditions
              </span>
              <p className="text-slate-200 font-semibold mt-1">
                {user.medicalConditions.length > 0 ? user.medicalConditions.join(', ') : 'None listed'}
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 font-bold block uppercase text-[10px]">
                Daily Medications
              </span>
              <p className="text-slate-200 font-semibold mt-1">
                {user.medications.length > 0 ? user.medications.join(', ') : 'None listed'}
              </p>
            </div>
          </div>

          {user.medicalNotes && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-amber-400 font-bold uppercase text-[10px] block mb-1">
                Special Paramedic & Helmet Notes
              </span>
              <p className="text-slate-300 leading-relaxed italic">{user.medicalNotes}</p>
            </div>
          )}
        </Card>

        {/* Emergency Contacts Directory */}
        <Card className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>All Designated Emergency Contacts</span>
          </h3>

          <div className="flex flex-col gap-2">
            {user.emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{contact.name}</span>
                    {contact.isPrimary && (
                      <span className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{contact.relationship}</p>
                  <p className="text-xs font-mono font-bold text-cyan-400">{contact.phone}</p>
                </div>

                <a
                  href={`tel:${contact.phone}`}
                  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>
            ))}
          </div>
        </Card>

        {/* Insurance & Policy Information */}
        <Card className="bg-slate-900/60 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Motorcycle & Medical Insurance:</span>
            <span className="font-bold text-slate-200">{user.insuranceCompany}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Policy Identifier:</span>
            <span className="font-mono font-bold text-cyan-400">{user.insurancePolicyNumber}</span>
          </div>
        </Card>

        {/* Share Coordinates / Paramedic Helper */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="md"
            className="flex-1"
            leftIcon={<Share2 className="w-4 h-4" />}
            onClick={handleShareEmergencyLocation}
          >
            Share Rider Emergency Data
          </Button>
          <a
            href="tel:911"
            className="px-4 py-2.5 bg-slate-800 hover:bg-red-600 text-red-400 hover:text-white rounded-xl border border-red-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Dial 911 / EMS</span>
          </a>
        </div>
      </div>
    </div>
  );
};
