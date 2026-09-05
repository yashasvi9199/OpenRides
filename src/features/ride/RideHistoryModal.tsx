// * Ride logs history panel.
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

interface RideHistoryModalContentProps {
  history: HistoryItem[];
}

export const RideHistoryModalContent: React.FC<RideHistoryModalContentProps> = ({
  history,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {history.length === 0 ? (
        <div className="text-center py-8 text-slate-600 font-medium">
          <p>No completed rides yet. Start your first ride to log telemetry!</p>
        </div>
      ) : (
        history.map((item) => (
          <Card key={item.id} className="bg-slate-50 border-slate-200 p-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2 mb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-0.5">
                  <Calendar className="w-3 h-3 text-cyan-700" />
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-700 font-medium border border-slate-200">
                <Users className="w-3 h-3 text-cyan-700" />
                <span>{item.participantCount} Riders</span>
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-600 block uppercase font-bold">Distance</span>
                <span className="text-xs sm:text-sm font-black font-mono text-cyan-800">
                  {item.distanceKm.toFixed(1)} km
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-600 block uppercase font-bold">Time</span>
                <span className="text-xs sm:text-sm font-black font-mono text-slate-900">
                  {formatDuration(item.durationSec)}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-600 block uppercase font-bold">Avg Speed</span>
                <span className="text-xs sm:text-sm font-black font-mono text-emerald-700">
                  {item.avgSpeedKmh} kph
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-600 block uppercase font-bold">Peak Speed</span>
                <span className="text-xs sm:text-sm font-black font-mono text-amber-700">
                  {item.maxSpeedKmh} kph
                </span>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

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
        <div className="flex items-center gap-2 text-cyan-700">
          <History className="w-5 h-5" />
          <span>Ride History & Telemetry Logs</span>
        </div>
      }
      subtitle="Past tracked routes, speeds, and group rides"
      maxWidth="lg"
    >
      <RideHistoryModalContent history={history} />
    </Modal>
  );
};
