// * Real-time dynamic telemetry readout panel.
import React from 'react';
import { RideSession } from '../../shared/types';
import { StatBadge } from '../../shared/components/StatBadge';
import { Card } from '../../shared/components/Card';
import {
  Gauge,
  Navigation,
  Compass,
  Battery,
  Timer,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { formatDuration, formatSpeed, formatDistance } from '../../shared/utils/formatters';

interface LiveTelemetryOverlayProps {
  session: RideSession;
  onConfirmCheckIn: () => void;
}

export const LiveTelemetryOverlay: React.FC<LiveTelemetryOverlayProps> = React.memo(({
  session,
  onConfirmCheckIn,
}) => {
  const hostParticipant = session.participants.find((p) => p.role === 'host') || session.participants[0];
  const durationSec = session.startTime > 0 ? Math.floor((Date.now() - session.startTime) / 1000) : 0;
  const leanAngle = session.currentLeanAngle || 0;
  const speed = session.currentSpeedKmh || 0;

  // Calculate speed percentage up to 140 km/h for gauge arc
  const speedRatio = Math.min(1, speed / 140);
  const strokeDashoffset = 280 - (speedRatio * 210);

  return (
    <div className="flex flex-col gap-3">
      {/* Primary Cockpit Card */}
      <Card variant="glass" className="relative overflow-hidden">
        {/* Glow backdrop based on speed */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Main Digital Speedometer Gauge */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Circular Gauge Track */}
              <svg className="w-full h-full transform -rotate-135" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-200"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="210"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-cyan-600 transition-all duration-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="280"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              {/* Central Speed Value */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-mono text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter">
                  {speed}
                </span>
                <span className="text-[11px] font-black tracking-widest text-cyan-700 uppercase -mt-1">
                  KM / H
                </span>
              </div>
            </div>

            {/* Lean Angle Simulator Pill */}
            <div className="flex items-center gap-2 mt-1 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 text-xs">
              <span className="text-slate-600 text-[10px] uppercase font-bold">Lean Angle:</span>
              <span
                className={`font-mono font-bold ${
                  Math.abs(leanAngle) > 20 ? 'text-amber-700' : 'text-emerald-700'
                }`}
              >
                {leanAngle > 0 ? `+${leanAngle}° R` : leanAngle < 0 ? `${leanAngle}° L` : `0°`}
              </span>
            </div>
          </div>

          {/* Telemetry Stat Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1 w-full">
            <StatBadge
              label="Trip Distance"
              value={session.distanceKm.toFixed(1)}
              unit="km"
              icon={<Navigation className="w-4 h-4" />}
              variant="cyan"
              subtext="GPS calculated"
            />
            <StatBadge
              label="Ride Time"
              value={formatDuration(durationSec)}
              icon={<Timer className="w-4 h-4" />}
              variant="slate"
              subtext={session.status === 'active' ? 'Tracking' : 'Paused'}
            />
            <StatBadge
              label="Peak Speed"
              value={session.maxSpeedKmh}
              unit="km/h"
              icon={<Zap className="w-4 h-4" />}
              variant="amber"
              subtext="Session record"
            />
            <StatBadge
              label="Device Battery"
              value={session.batteryPct}
              unit="%"
              icon={<Battery className="w-4 h-4" />}
              variant={session.batteryPct < 20 ? 'red' : 'emerald'}
              subtext="Power optimized"
            />
          </div>
        </div>

        {/* Dead-man's Safety Check-in Reminder Banner */}
        {session.status === 'active' && session.checkInDueAt && (
          <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Safety Check-in active: Automated guardian alert if inactive for 30m.
              </span>
            </div>
            <button
              onClick={onConfirmCheckIn}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors text-xs cursor-pointer shadow-sm"
            >
              I'm OK (Check-In)
            </button>
          </div>
        )}
      </Card>
    </div>
  );
});

LiveTelemetryOverlay.displayName = 'LiveTelemetryOverlay';
