import React from 'react';
import { CommonViewProps } from './views.types';
import { Navbar } from '../../shared/components/Navbar';
import { LiveRideMap } from '../map/LiveRideMap';
import { LiveTelemetryOverlay } from '../ride/LiveTelemetryOverlay';
import { RideController } from '../ride/RideController';
import { GroupRidersList } from '../ride/GroupRidersList';
import { GroupRideModal } from '../ride/GroupRideModal';
import { GroupRiderApprovalModal } from '../ride/GroupRiderApprovalModal';
import { CrashDetectionBanner } from '../ride/CrashDetectionBanner';
import { EmergencyQRModal } from '../sos/EmergencyQRModal';
import { MedicalProfileEditor } from '../sos/MedicalProfileEditor';
import { RideHistoryModal } from '../ride/RideHistoryModal';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { FamilyDashboard } from '../auth/FamilyDashboard';
import { QrCode, Heart } from 'lucide-react';

// * DesktopView layout: handles large viewport presentation and multi-column grid layouts.
export const DesktopView: React.FC<CommonViewProps> = ({
  user,
  currentRole,
  soundEnabled,
  activeView,
  currentSession,
  pendingRequests,
  crashAlert,
  history,
  isGroupModalOpen,
  setIsGroupModalOpen,
  isQRModalOpen,
  setIsQRModalOpen,
  isHistoryModalOpen,
  setIsHistoryModalOpen,
  setIsPublicEmergencyViewActive,
  handleRoleChange,
  handleManualRefresh,
  toggleSound,
  triggerSOS,
  updateProfile,
  addEmergencyContact,
  removeEmergencyContact,
  startRide,
  pauseRide,
  resumeRide,
  stopRide,
  joinGroupWithCode,
  approveJoinRequest,
  rejectJoinRequest,
  createJoinRequestSimulation,
  dismissSOS,
  triggerSimulatedCrash,
  dismissCrashAlert,
  confirmCheckIn,
  setActiveView,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* ! Warning: Navbar handles SOS triggering; ensure it stays accessible in all viewports. */}
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

      {/* ? Should we extract this sub-nav to a separate component to optimize App.tsx bundle size? */}
      <div className="flex border-b border-slate-200 bg-white/85 px-4 py-2">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleRoleChange(currentRole)}
              className={`px-3.5 py-1.5 rounded-lg text-fluid-xs font-bold transition-all cursor-pointer ${
                activeView === 'map'
                  ? 'bg-slate-100 text-cyan-600 border border-cyan-500/25'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Live Ride & Map
            </button>
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="relative px-3.5 py-1.5 rounded-lg text-fluid-xs font-bold text-slate-500 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
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
              className="px-3.5 py-1.5 rounded-lg text-fluid-xs font-bold text-slate-500 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5 text-red-500" />
              <span>Helmet QR Sticker</span>
            </button>
            <button
              onClick={() => handleRoleChange('rider')}
              className={`px-3.5 py-1.5 rounded-lg text-fluid-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeView === 'profile'
                  ? 'bg-slate-100 text-cyan-600 border border-cyan-500/25'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-emerald-500" />
              <span>Medical I.C.E.</span>
            </button>
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-fluid-xs font-bold text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
            >
              Ride History Logs
            </button>
          </div>

          <div className="flex items-center gap-2 text-fluid-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono">OpenStreetMap Tiles (Zero Cost)</span>
          </div>
        </div>
      </div>

      {/* * Main content area. Layout items are sized relative to window using clamp layout styles. */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-fluid flex flex-col gap-fluid pb-fluid">
        {currentRole === 'family' ? (
          // * Render Family Dashboard when role is set to guardian.
          <div className="flex flex-col gap-fluid">
            <FamilyDashboard
              user={user}
              session={currentSession}
              onManualRefresh={handleManualRefresh}
            />

            <LiveRideMap
              session={currentSession}
              onManualRefresh={handleManualRefresh}
              className="h-[620px] w-full"
              isFamilyMode={true}
            />

            <GroupRidersList participants={currentSession.participants} />
          </div>
        ) : activeView === 'profile' ? (
          // * Render Medical Profile editor.
          <MedicalProfileEditor
            user={user}
            onSave={updateProfile}
            onAddContact={addEmergencyContact}
            onRemoveContact={removeEmergencyContact}
          />
        ) : (
          // * Rider Live Cockpit: contains live maps, speedometer telemetry, wingmen roster and emergency info card.
          <div className="flex flex-col gap-fluid">
            <LiveTelemetryOverlay
              session={currentSession}
              onConfirmCheckIn={confirmCheckIn}
            />

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

            <LiveRideMap
              session={currentSession}
              onManualRefresh={handleManualRefresh}
              className="h-[560px] w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-fluid">
              <div className="md:col-span-2">
                <GroupRidersList participants={currentSession.participants} />
              </div>

              {/* TODO: Helmet QR sticker print integration option could be placed here. */}
              <Card className="flex flex-col justify-between gap-fluid p-fluid">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-fluid-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>Helmet Medical ID</span>
                    </span>
                    <span className="text-fluid-xs font-mono font-bold text-slate-700">
                      {user.bloodGroup.split(' ')[0]}
                    </span>
                  </div>

                  <p className="text-fluid-xs text-slate-700 mt-2.5">
                    Rider: <strong className="text-slate-900">{user.name}</strong>
                  </p>
                  <p className="text-fluid-xs text-slate-600">
                    Primary ICE: {user.emergencyContacts[0]?.name || 'Not set'} (
                    {user.emergencyContacts[0]?.phone || 'N/A'})
                  </p>
                  <p className="text-fluid-xs text-amber-700 mt-1">
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

      {/* * Modal overlays are globally appended at the bottom. */}
      <GroupRideModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        rideCode={currentSession.code}
        onJoinCodeSubmit={joinGroupWithCode}
        onSimulateIncomingRequest={createJoinRequestSimulation}
      />

      <GroupRiderApprovalModal
        pendingRequests={pendingRequests}
        onApprove={approveJoinRequest}
        onReject={rejectJoinRequest}
      />

      <CrashDetectionBanner
        alert={crashAlert}
        onDismiss={dismissCrashAlert}
        onConfirmSOS={() => {
          dismissCrashAlert();
          triggerSOS();
        }}
      />

      <EmergencyQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        user={user}
        onOpenPublicView={() => setIsPublicEmergencyViewActive(true)}
      />

      <RideHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
      />
    </div>
  );
};
