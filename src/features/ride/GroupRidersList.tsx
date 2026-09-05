// * Active session participants list.
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
          ? 'bg-red-50 border-red-300 shadow-sm'
          : isHost
          ? 'bg-cyan-50/70 border-cyan-200'
          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
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
                : 'bg-slate-200 border-slate-300 text-slate-800'
            }`}
          >
            {participant.name.slice(0, 2).toUpperCase()}
          </div>
          {/* Live ping dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-bold text-slate-900 truncate">{participant.name}</p>
            {isHost && (
              <span className="text-[10px] font-bold uppercase bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded border border-cyan-200">
                Host
              </span>
            )}
            {isSOS && (
              <span className="text-[10px] font-bold uppercase bg-red-600 text-white px-1.5 py-0.2 rounded animate-pulse">
                SOS ALERT
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 truncate">{participant.bikeModel}</p>
        </div>
      </div>

      {/* Metrics & Quick Call */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="flex items-center justify-end gap-1 text-xs font-mono font-bold text-slate-800">
            <Gauge className="w-3.5 h-3.5 text-cyan-700" />
            <span>{participant.speedKmh} km/h</span>
          </div>
          <div className="flex items-center justify-end gap-1 text-[10px] text-slate-600 font-mono font-medium">
            <Battery className="w-3.5 h-3.5 text-emerald-600" />
            <span>{participant.batteryPct}%</span>
          </div>
        </div>

        <a
          href={`tel:${participant.phone}`}
          className="p-2 bg-white hover:bg-cyan-500 hover:text-slate-950 text-slate-700 rounded-xl transition-all border border-slate-200 shadow-sm active:scale-95"
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
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Active Group Roster
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full border border-cyan-200">
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
