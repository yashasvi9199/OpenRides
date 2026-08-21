import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from './features/auth/authStore';
import { useRideStore } from './features/ride/rideStore';
import { Navbar } from './shared/components/Navbar';
import { BottomNav } from './shared/components/BottomNav';
import { ToastProvider, useToast } from './shared/components/Toast';
import { LiveRideMap } from './features/map/LiveRideMap';
import { LiveTelemetryOverlay } from './features/ride/LiveTelemetryOverlay';
import { RideController } from './features/ride/RideController';
import { GroupRidersList } from './features/ride/GroupRidersList';
import { GroupRideModal } from './features/ride/GroupRideModal';
import { GroupRiderApprovalModal } from './features/ride/GroupRiderApprovalModal';
import { CrashDetectionBanner } from './features/ride/CrashDetectionBanner';
import { EmergencyQRModal } from './features/sos/EmergencyQRModal';
import { MedicalProfileEditor } from './features/sos/MedicalProfileEditor';
import { PublicEmergencyView } from './features/sos/PublicEmergencyView';
import { FamilyDashboard } from './features/auth/FamilyDashboard';
import { RideHistoryModal } from './features/ride/RideHistoryModal';
import {
  Shield,
  Activity,
  Users,
  Heart,
  QrCode,
  Sparkles,
  Info,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Button } from './shared/components/Button';
import { Card } from './shared/components/Card';

const MainAppContent: React.FC = () => {
  const {
    currentRole,
    user,
    soundEnabled,
    activeView,
    setRole,
    setActiveView,
    updateProfile,
    addEmergencyContact,
    removeEmergencyContact,
    toggleSound,
  } = useAuthStore();

  const {
    currentSession,
    pendingRequests,
    crashAlert,
    history,
    startRide,
    pauseRide,
    resumeRide,
    stopRide,
    joinGroupWithCode,
    approveJoinRequest,
    rejectJoinRequest,
    createJoinRequestSimulation,
    manualRefreshPositions,
    triggerSOS,
    dismissSOS,
    triggerSimulatedCrash,
    dismissCrashAlert,
    confirmCheckIn,
  } = useRideStore();

  const { success, info } = useToast();

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPublicEmergencyViewActive, setIsPublicEmergencyViewActive] = useState(false);

  // Check URL pathname for /sos/ route on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/sos/')) {
        setIsPublicEmergencyViewActive(true);
      }
    }
  }, []);

  const handleRoleChange = useCallback(
    (newRole: 'rider' | 'family' | 'guest') => {
      setRole(newRole);
      if (newRole === 'family') {
        info('Switched to Family Guardian View', 'Live location and safety metrics updated for connected rider.');
      } else {
        info('Switched to Rider Cockpit', 'Telemetry tracking, group codes, and emergency QR active.');
      }
    },
    [setRole, info]
  );

  const handleManualRefresh = useCallback(() => {
    manualRefreshPositions();
    success('Map Telemetry Refreshed', 'Latest GPS coordinates & wingmen positions synced.');
  }, [manualRefreshPositions, success]);

  // If in public unauthenticated emergency view (e.g. from QR code scan)
  if (isPublicEmergencyViewActive) {
    return (
      <PublicEmergencyView
        user={user}
        onBackToApp={() => setIsPublicEmergencyViewActive(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Main Navigation */}
      <Navbar
        currentRole={currentRole}
        user={user}
        soundEnabled={soundEnabled}
        onRoleChange={handleRoleChange}
        onToggleSound={toggleSound}
        onOpenQR={() => setIsQRModalOpen(true)}
        onTriggerSOS={triggerSOS}
        isSOSActive={currentSession.status === 'sos'}
      />

      {/* Desktop Secondary Sub-Nav Tabs */}
      <div className="hidden sm:flex border-b border-slate-800/80 bg-slate-900/60 px-4 py-2">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveView('map')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'map'
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Ride & Map
            </button>
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="relative px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Group Sync (#{currentSession.code})</span>
              {pendingRequests.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {pendingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5 text-red-400" />
              <span>Helmet QR Sticker</span>
            </button>
            <button
              onClick={() => setActiveView('profile')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeView === 'profile'
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              <span>Medical I.C.E.</span>
            </button>
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              Ride History Logs
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">OpenStreetMap Tiles (Zero Cost)</span>
          </div>
        </div>
      </div>

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-6 flex flex-col gap-5 pb-24 sm:pb-8">
        {/* Render Family Guardian Dashboard View if role is 'family' */}
        {currentRole === 'family' ? (
          <div className="flex flex-col gap-5">
            <FamilyDashboard
              user={user}
              session={currentSession}
              onManualRefresh={handleManualRefresh}
            />

            {/* Live Guardian Map Canvas */}
            <LiveRideMap
              session={currentSession}
              onManualRefresh={handleManualRefresh}
              className="h-[480px] sm:h-[620px] w-full"
              isFamilyMode={true}
            />

            {/* Connected Wingmen in Rider's group */}
            <GroupRidersList participants={currentSession.participants} />
          </div>
        ) : activeView === 'profile' ? (
          /* Medical Profile & I.C.E. Editor */
          <MedicalProfileEditor
            user={user}
            onSave={updateProfile}
            onAddContact={addEmergencyContact}
            onRemoveContact={removeEmergencyContact}
          />
        ) : (
          /* Rider Live Cockpit View */
          <div className="flex flex-col gap-5">
            {/* Speedometer & Real-time Cockpit Overlay */}
            <LiveTelemetryOverlay
              session={currentSession}
              onConfirmCheckIn={confirmCheckIn}
            />

            {/* Ride Action Controller Bar */}
            <RideController
              session={currentSession}
              onStartRide={() => startRide(currentSession.title)}
              onPauseRide={pauseRide}
              onResumeRide={resumeRide}
              onStopRide={stopRide}
              onOpenGroupModal={() => setIsGroupModalOpen(true)}
              onTriggerSOS={triggerSOS}
              onDismissSOS={dismissSOS}
              onSimulateCrash={triggerSimulatedCrash}
              onOpenHistory={() => setIsHistoryModalOpen(true)}
            />

            {/* Leaflet Live Map Canvas with Explicit Manual Refresh Button */}
            <LiveRideMap
              session={currentSession}
              onManualRefresh={handleManualRefresh}
              className="h-[440px] sm:h-[560px] w-full"
            />

            {/* Bottom Group Roster & Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <GroupRidersList participants={currentSession.participants} />
              </div>

              {/* Quick Emergency Medical Card Preview Box */}
              <Card className="flex flex-col justify-between gap-3 bg-gradient-to-br from-slate-900 to-slate-950">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>Helmet Medical ID</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {user.bloodGroup.split(' ')[0]}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5">
                    Rider: <strong className="text-white">{user.name}</strong>
                  </p>
                  <p className="text-xs text-slate-400">
                    Primary ICE: {user.emergencyContacts[0]?.name || 'Not set'} (
                    {user.emergencyContacts[0]?.phone || 'N/A'})
                  </p>
                  <p className="text-xs text-amber-300 mt-1">
                    Allergies: {user.allergies.join(', ') || 'None recorded'}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<QrCode className="w-3.5 h-3.5 text-cyan-400" />}
                    onClick={() => setIsQRModalOpen(true)}
                  >
                    View QR & PDF Badge
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsPublicEmergencyViewActive(true)}
                  >
                    Test Public View
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      {/* 1. Group Ride Secret Code & Join Modal */}
      <GroupRideModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        rideCode={currentSession.code}
        onJoinCodeSubmit={joinGroupWithCode}
        onSimulateIncomingRequest={createJoinRequestSimulation}
      />

      {/* 2. Host Approval Interactive Modal Prompt */}
      <GroupRiderApprovalModal
        pendingRequests={pendingRequests}
        onApprove={approveJoinRequest}
        onReject={rejectJoinRequest}
      />

      {/* 3. Crash Detection 10-second Siren Countdown */}
      <CrashDetectionBanner
        alert={crashAlert}
        onDismiss={dismissCrashAlert}
        onConfirmSOS={() => {
          dismissCrashAlert();
          triggerSOS();
        }}
      />

      {/* 4. Emergency QR & PDF Exporter Modal */}
      <EmergencyQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        user={user}
        onOpenPublicView={() => setIsPublicEmergencyViewActive(true)}
      />

      {/* 5. Past Rides History Modal */}
      <RideHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeView={activeView}
        onViewChange={(view) => {
          if (view === 'group') {
            setIsGroupModalOpen(true);
          } else if (view === 'sos') {
            setIsQRModalOpen(true);
          } else if (view === 'history') {
            setIsHistoryModalOpen(true);
          } else {
            setActiveView(view);
          }
        }}
        pendingRequestCount={pendingRequests.length}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <MainAppContent />
    </ToastProvider>
  );
}
