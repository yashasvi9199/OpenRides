// * Crash Detection countdown alert overlay.
import React from 'react';
import { CrashAlert } from '../../shared/types';
import { Button } from '../../shared/components/Button';
import { ShieldAlert, AlertTriangle, PhoneCall, CheckCircle2 } from 'lucide-react';
import { formatCoordinates } from '../../shared/utils/geo';

interface CrashDetectionBannerProps {
  alert: CrashAlert | null;
  onDismiss: () => void;
  onConfirmSOS: () => void;
}

export const CrashDetectionBanner: React.FC<CrashDetectionBannerProps> = ({
  alert,
  onDismiss,
  onConfirmSOS,
}) => {
  if (!alert || !alert.active) return null;

  const seconds = alert.countdownRemaining;
  const progressPct = (seconds / 10) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-950 border-2 border-red-500 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-600/50 flex flex-col items-center text-center gap-5 animate-in zoom-in-95">
        {/* Pulsing Hazard Icon */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-red-600/30 animate-ping absolute" />
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/80">
            <ShieldAlert className="w-10 h-10" />
          </div>
        </div>

        <div>
          <span className="text-xs uppercase font-black tracking-widest text-red-400 bg-red-950 px-3 py-1 rounded-full border border-red-800">
            Crash Incident Detected ({alert.impactGForce}G Impact)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Are You Injured or Need Help?
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-sm">
            High impact detected at {alert.speedBeforeCrashKmh} km/h. Emergency contacts and family will receive SOS dispatch coordinates in:
          </p>
        </div>

        {/* Big Countdown Number */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-6xl sm:text-7xl font-black text-red-500 tracking-tight drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
            {seconds}s
          </span>
          {/* Progress Bar */}
          <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-red-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* GPS Coordinates Preview */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300 font-mono">
          📍 Lat/Lng: {formatCoordinates(alert.location.lat, alert.location.lng)}
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-3 pt-2">
          <button
            onClick={onDismiss}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>I AM OK — CANCEL SOS</span>
          </button>

          <Button
            variant="danger"
            size="md"
            leftIcon={<PhoneCall className="w-4 h-4" />}
            onClick={onConfirmSOS}
          >
            Send SOS Broadcast Immediately
          </Button>
        </div>
      </div>
    </div>
  );
};
