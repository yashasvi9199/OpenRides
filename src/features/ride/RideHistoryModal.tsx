import React from 'react';
import { Modal } from '../../shared/components/Modal';
import { Card } from '../../shared/components/Card';
import { History, Calendar, Clock, Navigation, Zap, Users } from 'lucide-react';
import { formatDate, formatDuration, formatSpeed } from '../../shared/utils/formatters';

interface HistoryItem {
  id: string;
  title: string;
  date: number;
  durationSec: number;
  distanceKm: number;
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  participantCount: number;
}

interface RideHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
}

export const RideHistoryModal: React.FC<RideHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-cyan-400">
          <History className="w-5 h-5" />
          <span>Ride History & Telemetry Logs</span>
        </div>
      }
      subtitle="Past tracked routes, speeds, and group rides"
      maxWidth="lg"
    >
      <div className="flex flex-col gap-3">
        {history.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No completed rides yet. Start your first ride to log telemetry!</p>
          </div>
        ) : (
          history.map((item) => (
            <Card key={item.id} className="bg-slate-950/70 border-slate-800 p-4">
              <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2 mb-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-100">{item.title}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                  <Users className="w-3 h-3 text-cyan-400" />
                  <span>{item.participantCount} Riders</span>
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Distance</span>
                  <span className="text-xs sm:text-sm font-black font-mono text-cyan-400">
                    {item.distanceKm.toFixed(1)} km
                  </span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Time</span>
                  <span className="text-xs sm:text-sm font-black font-mono text-slate-200">
                    {formatDuration(item.durationSec)}
                  </span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Avg Speed</span>
                  <span className="text-xs sm:text-sm font-black font-mono text-emerald-400">
                    {item.avgSpeedKmh} kph
                  </span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Peak Speed</span>
                  <span className="text-xs sm:text-sm font-black font-mono text-amber-400">
                    {item.maxSpeedKmh} kph
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Modal>
  );
};
