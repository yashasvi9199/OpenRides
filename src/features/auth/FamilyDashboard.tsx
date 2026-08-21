import React from 'react';
import { UserProfile, RideSession } from '../../shared/types';
import { Card } from '../../shared/components/Card';
import { StatBadge } from '../../shared/components/StatBadge';
import { Button } from '../../shared/components/Button';
import {
  ShieldCheck,
  Heart,
  Phone,
  Battery,
  Gauge,
  MapPin,
  Clock,
  AlertTriangle,
  RotateCw,
  Bell,
} from 'lucide-react';
import { formatDistance, formatDuration, formatSpeed, formatTimestamp } from '../../shared/utils/formatters';
import { useToast } from '../../shared/components/Toast';

interface FamilyDashboardProps {
  user: UserProfile;
  session: RideSession;
  onManualRefresh: () => void;
}

export const FamilyDashboard: React.FC<FamilyDashboardProps> = ({
  user,
  session,
  onManualRefresh,
}) => {
  const { success, info } = useToast();
  const host = session.participants.find((p) => p.role === 'host') || session.participants[0];
  const isMoving = session.status === 'active' && session.currentSpeedKmh > 5;
  const isSOS = session.status === 'sos';

  const handlePingRider = () => {
    info('Check-in Prompt Sent', `Notification ping dispatched to ${user.name}'s helmet unit.`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Guardian Status Header Card */}
      <Card
        variant={isSOS ? 'danger' : 'highlight'}
        className="relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg ${
                isSOS
                  ? 'bg-red-600 text-white animate-bounce'
                  : 'bg-cyan-500 text-slate-950'
              }`}
            >
              {isSOS ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-black text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Guardian Guardian View
                </span>
                <span className="text-xs text-slate-400">
                  Last Sync: {formatTimestamp(session.lastUpdated)}
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                Monitoring Rider: {user.name}
              </h2>
              <p className="text-xs text-slate-300">
                🏍️ {user.bikeModel} • License {user.bikeNumber}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCw className="w-3.5 h-3.5" />}
              onClick={onManualRefresh}
            >
              Refresh Map
            </Button>
            <a
              href={`tel:${user.phone}`}
              className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
            </a>
          </div>
        </div>

        {/* Live Status Banner */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isSOS
                  ? 'bg-red-500 animate-ping'
                  : isMoving
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-xs font-bold text-slate-200">
              {isSOS
                ? '🚨 EMERGENCY SOS TRIGGERED BY RIDER'
                : isMoving
                ? `Riding on ${session.title} (${session.currentSpeedKmh} km/h)`
                : session.status === 'paused'
                ? 'Rider is taking a break / stationary'
                : 'Rider is currently off the bike / idle'}
            </span>
          </div>

          <button
            onClick={handlePingRider}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Send Check-in Buzz</span>
          </button>
        </div>
      </Card>

      {/* Guardian Telemetry Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBadge
          label="Current Speed"
          value={session.currentSpeedKmh}
          unit="km/h"
          icon={<Gauge className="w-4 h-4" />}
          variant="cyan"
        />
        <StatBadge
          label="Trip Distance"
          value={session.distanceKm.toFixed(1)}
          unit="km"
          icon={<MapPin className="w-4 h-4" />}
          variant="slate"
        />
        <StatBadge
          label="Phone Battery"
          value={session.batteryPct}
          unit="%"
          icon={<Battery className="w-4 h-4" />}
          variant={session.batteryPct < 20 ? 'red' : 'emerald'}
        />
        <StatBadge
          label="Wingmen In Group"
          value={session.participants.length}
          unit="riders"
          icon={<ShieldCheck className="w-4 h-4" />}
          variant="amber"
        />
      </div>
    </div>
  );
};
