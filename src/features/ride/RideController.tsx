// * Ride Controller console panel.
import React, { useState } from 'react';
import { RideSession } from '../../shared/types';
import { Button } from '../../shared/components/Button';
import {
  Play,
  Pause,
  Square,
  Users,
  ShieldAlert,
  History,
  Activity,
  Sparkles,
} from 'lucide-react';
import './ride.styles.css';

interface RideControllerProps {
  session: RideSession;
  onStartRide: () => void;
  onPauseRide: () => void;
  onResumeRide: () => void;
  onStopRide: () => void;
  onOpenGroupModal: () => void;
  onTriggerSOS: () => void;
  onDismissSOS: () => void;
  onSimulateCrash: () => void;
  onOpenHistory: () => void;
}

export const RideController: React.FC<RideControllerProps> = React.memo(({
  session,
  onStartRide,
  onPauseRide,
  onResumeRide,
  onStopRide,
  onOpenGroupModal,
  onTriggerSOS,
  onDismissSOS,
  onSimulateCrash,
  onOpenHistory,
}) => {
  const isIdle = session.status === 'idle' || session.status === 'completed';
  const isActive = session.status === 'active';
  const isPaused = session.status === 'paused';
  const isSOS = session.status === 'sos';

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl shadow-xl">
      {/* Primary Ride Start / Pause / Stop Controls */}
      <div className="flex items-center gap-1.5 flex-1 w-full overflow-x-auto pb-1 sm:pb-0">
        {isIdle ? (
          <Button
            variant="primary"
            size="md"
            className="flex-1 sm:flex-none sm:min-w-[160px] text-xs py-2"
            leftIcon={<Play className="w-4 h-4 fill-current" />}
            onClick={onStartRide}
          >
            Start Safety Ride
          </Button>
        ) : (
          <>
            {isActive ? (
              <Button
                variant="amber"
                size="md"
                className="flex-1 sm:flex-none"
                leftIcon={<Pause className="w-4 h-4 fill-current" />}
                onClick={onPauseRide}
              >
                Pause
              </Button>
            ) : (
              <Button
                variant="success"
                size="md"
                className="flex-1 sm:flex-none"
                leftIcon={<Play className="w-4 h-4 fill-current" />}
                onClick={onResumeRide}
              >
                Resume
              </Button>
            )}

            <Button
              variant="secondary"
              size="md"
              leftIcon={<Square className="w-4 h-4 fill-current text-red-400" />}
              onClick={onStopRide}
            >
              End Ride
            </Button>
          </>
        )}

        {/* Group Ride Code & Roster Button */}
        <Button
          variant="outline"
          size="md"
          leftIcon={<Users className="w-4 h-4 text-cyan-700" />}
          onClick={onOpenGroupModal}
          title="Share Secret 6-Digit Code"
          className="text-xs"
        >
          <span className="hidden sm:inline text-slate-700">Code:</span>
          <span className="font-mono text-cyan-700 font-bold">#{session.code}</span>
        </Button>
      </div>

      {/* Secondary & Safety Tools */}
      <div className="flex items-center gap-2">
        {/* Ride History */}
        <button
          onClick={onOpenHistory}
          className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          title="Ride History"
          aria-label="View Ride History"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Test Simulated Crash Sensor Button */}
        <button
          onClick={onSimulateCrash}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          title="Test Gyroscope / G-Force Crash Sensor & 10s Countdown"
        >
          <Activity className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden md:inline">Test Crash</span>
        </button>

        {/* Emergency SOS Broadcast Button */}
        {isSOS ? (
          <Button
            variant="success"
            size="md"
            leftIcon={<ShieldAlert className="w-4 h-4" />}
            onClick={onDismissSOS}
          >
            Cancel SOS
          </Button>
        ) : (
          <Button
            variant="danger"
            size="md"
            leftIcon={<ShieldAlert className="w-4 h-4" />}
            onClick={onTriggerSOS}
          >
            Emergency SOS
          </Button>
        )}
      </div>
    </div>
  );
});

RideController.displayName = 'RideController';
