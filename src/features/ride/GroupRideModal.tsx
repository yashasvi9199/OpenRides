// * Group Sync join code popup dialog.
import React, { useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { Button } from '../../shared/components/Button';
import { QRCodeSVG } from 'qrcode.react';
import { Users, Copy, Check, UserPlus, Sparkles, KeyRound, ShieldAlert } from 'lucide-react';
import { useToast } from '../../shared/components/Toast';

interface GroupRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  rideCode: string;
  onJoinCodeSubmit: (code: string, riderInfo: { name: string; phone: string; bikeModel: string }) => boolean;
  onSimulateIncomingRequest: (name: string, bike: string) => void;
}

interface GroupRideModalContentProps {
  rideCode: string;
  onJoinCodeSubmit: (code: string, riderInfo: { name: string; phone: string; bikeModel: string }) => boolean;
  onSimulateIncomingRequest: (name: string, bike: string) => void;
}

export const GroupRideModalContent: React.FC<GroupRideModalContentProps> = ({
  rideCode,
  onJoinCodeSubmit,
  onSimulateIncomingRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'host' | 'join'>('host');
  const [inputCode, setInputCode] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestBike, setGuestBike] = useState('');
  const [copied, setCopied] = useState(false);
  const { success, error, info } = useToast();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rideCode);
    setCopied(true);
    success('Secret Code Copied!', `Group code #${rideCode} copied to clipboard.`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim().length !== 6) {
      error('Invalid Code', 'Please enter a valid 6-digit numerical ride code.');
      return;
    }

    const ok = onJoinCodeSubmit(inputCode, {
      name: guestName || 'Rider Guest',
      phone: '+1 (555) 777-8899',
      bikeModel: guestBike || 'Custom Cruiser',
    });

    if (ok) {
      success('Join Request Sent', 'Waiting for host rider approval...');
      setInputCode('');
    }
  };

  // Dummy mock riders commented out per user request:
  /*
  const MOCK_RIDERS = [
    { name: 'Jordan Miller', bike: 'Kawasaki Ninja ZX-6R' },
    { name: 'Elena Rostova', bike: 'BMW S1000RR M-Package' },
    { name: 'Marcus Brody', bike: 'Harley-Davidson Low Rider S' },
    { name: 'Chloe Dubois', bike: 'Triumph Street Triple 765' },
  ];
  */

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 text-cyan-700 border-b border-slate-200 pb-3">
        <Users className="w-5 h-5" />
        <h2 className="text-lg font-bold text-slate-900">Group Ride Sync</h2>
      </div>
      <p className="text-xs text-slate-600 -mt-2">Share secret 6-digit code or join fellow wingmen</p>
      
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('host')}
          className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'host'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          My Ride Code (Host)
        </button>
        <button
          onClick={() => setActiveTab('join')}
          className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'join'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Enter 6-Digit Code
        </button>
      </div>

      {activeTab === 'host' ? (
        <div className="flex flex-col items-center text-center gap-4">
          {/* 6-Digit Code Card */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-slate-600 font-bold">
              Your 6-Digit Secret Ride Code
            </span>

            <div className="flex items-center gap-2">
              <span className="font-mono text-4xl sm:text-5xl font-black text-cyan-800 tracking-[0.2em] bg-white px-6 py-2.5 rounded-2xl border border-cyan-500/40 shadow-inner">
                {rideCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                title="Copy Code"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-xs text-slate-600 max-w-sm">
              Have other riders enter this code in their OpenRides app or scan the QR below. You will receive an approval prompt before they can view your live telemetry.
            </p>
          </div>

          {/* QR Code for Fast Join */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-lg flex flex-col items-center">
            <QRCodeSVG
              value={`openrides://join/${rideCode}`}
              size={140}
              level="H"
              includeMargin={false}
            />
            <span className="text-[10px] text-slate-900 font-bold mt-1.5 font-mono">
              SCAN TO JOIN #{rideCode}
            </span>
          </div>

          {/* Simulated Incoming Request Trigger commented out per user request:
          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Test Host Approval Flow (Simulation)</span>
              </span>
              <span className="text-[10px] text-slate-600 uppercase font-mono font-bold">Instant Preview</span>
            </div>
            <p className="text-[11px] text-slate-600 mb-2.5">
              Click any rider below to simulate them typing your secret code and triggering the host approval modal:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_RIDERS.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSimulateIncomingRequest(r.name, r.bike);
                    info('Simulation Triggered', `${r.name} sent join request for code #${rideCode}`);
                  }}
                  className="p-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyan-500/50 rounded-lg text-left transition-colors cursor-pointer"
                >
                  <p className="text-xs font-bold text-slate-900 truncate">{r.name}</p>
                  <p className="text-[10px] text-slate-600 truncate">{r.bike}</p>
                </button>
              ))}
            </div>
          </div>
          */}
        </div>
      ) : (
        <form onSubmit={handleJoinSubmit} className="flex flex-col gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <label className="text-xs uppercase tracking-wider font-bold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-cyan-600" />
              <span>6-Digit Secret Ride Code</span>
            </label>
            <input
              type="text"
              maxLength={6}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 748291"
              className="w-full bg-white border border-slate-200 focus:border-cyan-500 rounded-xl px-4 py-3 text-2xl font-mono tracking-widest text-center text-cyan-700 font-bold focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
            <p className="text-[11px] text-slate-500">
              Ask your ride leader for their 6-digit code or scan their QR badge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Liam Ross"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Your Bike Model</label>
              <input
                type="text"
                value={guestBike}
                onChange={(e) => setGuestBike(e.target.value)}
                placeholder="e.g. KTM 890 Adventure"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            leftIcon={<UserPlus className="w-5 h-5" />}
            className="mt-2"
          >
            Request Access to Ride
          </Button>
        </form>
      )}
    </div>
  );
};

export const GroupRideModal: React.FC<GroupRideModalProps> = ({
  isOpen,
  onClose,
  rideCode,
  onJoinCodeSubmit,
  onSimulateIncomingRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'host' | 'join'>('host');
  const [inputCode, setInputCode] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestBike, setGuestBike] = useState('');
  const [copied, setCopied] = useState(false);
  const { success, error, info } = useToast();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rideCode);
    setCopied(true);
    success('Secret Code Copied!', `Group code #${rideCode} copied to clipboard.`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim().length !== 6) {
      error('Invalid Code', 'Please enter a valid 6-digit numerical ride code.');
      return;
    }

    const ok = onJoinCodeSubmit(inputCode, {
      name: guestName || 'Rider Guest',
      phone: '+1 (555) 777-8899',
      bikeModel: guestBike || 'Custom Cruiser',
    });

    if (ok) {
      success('Join Request Sent', 'Waiting for host rider approval...');
      setInputCode('');
      onClose();
    }
  };

  const MOCK_RIDERS = [
    { name: 'Jordan Miller', bike: 'Kawasaki Ninja ZX-6R' },
    { name: 'Elena Rostova', bike: 'BMW S1000RR M-Package' },
    { name: 'Marcus Brody', bike: 'Harley-Davidson Low Rider S' },
    { name: 'Chloe Dubois', bike: 'Triumph Street Triple 765' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-cyan-700">
          <Users className="w-5 h-5" />
          <span>Group Ride Sync</span>
        </div>
      }
      subtitle="Share secret 6-digit code or join fellow wingmen"
      maxWidth="lg"
    >
      <GroupRideModalContent
        rideCode={rideCode}
        onJoinCodeSubmit={onJoinCodeSubmit}
        onSimulateIncomingRequest={onSimulateIncomingRequest}
      />
    </Modal>
  );
};
