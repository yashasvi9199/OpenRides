// * Navbar Component: Top header navigation bar.
import React from 'react';
import { UserRole, UserProfile } from '../types';
import {
  Shield,
  Volume2,
  VolumeX,
  Users,
  QrCode,
  Heart,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { Button } from './Button';

interface NavbarProps {
  currentRole: UserRole;
  user: UserProfile;
  soundEnabled: boolean;
  onRoleChange: (role: UserRole) => void;
  onToggleSound: () => void;
  onOpenQR: () => void;
  onTriggerSOS: () => void;
  isSOSActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({
  currentRole,
  user,
  soundEnabled,
  onRoleChange,
  onToggleSound,
  onOpenQR,
  onTriggerSOS,
  isSOSActive,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            <Shield className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-slate-900">OpenRides</span>
              <span className="text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200 px-1.5 py-0.2 rounded font-mono">
                100% FREE
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block">
              Bike Rider Safety, Telemetry & Live Emergency Tracking
            </p>
          </div>
        </div>

        {/* Center: Role Switcher (Rider vs Family) */}
        <div className="bg-slate-100 border border-slate-200 p-1 rounded-xl flex items-center gap-1">
          <button
            onClick={() => onRoleChange('rider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentRole === 'rider'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏍️ Rider</span>
          </button>
          <button
            onClick={() => onRoleChange('family')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentRole === 'family'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🛡️ Family</span>
          </button>
        </div>

        {/* Right Actions: Sound, QR Badge, and Emergency SOS */}
        <div className="flex items-center gap-2">
          {/* Sound Mute/Unmute Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-950 bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Alert Audio' : 'Unmute Audio Alerts'}
            aria-label="Toggle sound alerts"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Quick QR Medical Sticker button */}
          <button
            onClick={onOpenQR}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-200 hover:border-cyan-500/40 transition-colors cursor-pointer"
            title="Open Emergency QR Sticker"
          >
            <QrCode className="w-4 h-4 text-red-500" />
            <span>Emergency QR</span>
          </button>

          {/* Direct SOS Trigger */}
          <button
            onClick={onTriggerSOS}
            className={`px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
              isSOSActive
                ? 'bg-red-600 text-white animate-pulse shadow-red-600/50'
                : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
});

Navbar.displayName = 'Navbar';
