import React from 'react';
import { RideParticipant } from '../../shared/types';
import { Card } from '../../shared/components/Card';
import { Battery, Gauge, Phone, Shield, ShieldAlert, Wifi } from 'lucide-react';
import { formatTimestamp } from '../../shared/utils/formatters';

interface GroupRidersListProps {
  participants: RideParticipant[];
  onCallRider?: (phone: string) => void;
}

// Heavy list item wrapped with React.memo for 60 FPS performance
const RiderListItem: React.FC<{
  participant: RideParticipant;
  onCall?: () => void;
}> = React.memo(({ participant, onCall }) => {
  const isHost = participant.role === 'host';
  const isSOS = participant.isSOS;

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
        isSOS
          ? 'bg-red-950/40 border-red-500/80 shadow-lg shadow-red-950/50'
          : isHost
          ? 'bg-cyan-950/20 border-cyan-500/30'
          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar / Role Badge */}
        <div className="relative">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
              isSOS
                ? 'bg-red-600 border-white text-white animate-bounce'
                : isHost
                ? 'bg-cyan-500 border-cyan-300 text-slate-950'
                : 'bg-slate-700 border-slate-600 text-slate-200'
            }`}
          >
            {participant.name.slice(0, 2).toUpperCase()}
          </div>
          {/* Live ping dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-bold text-slate-100 truncate">{participant.name}</p>
            {isHost && (
              <span className="text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-500/30">
                Host
              </span>
            )}
            {isSOS && (
              <span className="text-[10px] font-bold uppercase bg-red-600 text-white px-1.5 py-0.2 rounded animate-pulse">
                SOS ALERT
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate">{participant.bikeModel}</p>
        </div>
      </div>

      {/* Metrics & Quick Call */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="flex items-center justify-end gap-1 text-xs font-mono font-bold text-slate-200">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>{participant.speedKmh} km/h</span>
          </div>
          <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-mono">
            <Battery className="w-3 h-3 text-emerald-400" />
            <span>{participant.batteryPct}%</span>
          </div>
        </div>

        <a
          href={`tel:${participant.phone}`}
          className="p-2 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 rounded-xl transition-all border border-slate-700 active:scale-95"
          title={`Call ${participant.name}`}
          aria-label={`Call ${participant.name}`}
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
});

RiderListItem.displayName = 'RiderListItem';

export const GroupRidersList: React.FC<GroupRidersListProps> = React.memo(({
  participants,
}) => {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Active Group Roster
          </h3>
        </div>
        <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/50">
          {participants.length} Synced
        </span>
      </div>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        {participants.map((rider) => (
          <RiderListItem key={rider.id} participant={rider} />
        ))}
      </div>
    </Card>
  );
});

GroupRidersList.displayName = 'GroupRidersList';
