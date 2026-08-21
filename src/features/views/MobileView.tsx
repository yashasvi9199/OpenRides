import React from 'react';
import { CommonViewProps } from './views.types';
import { Navbar } from '../../shared/components/Navbar';
import { BottomNav } from '../../shared/components/BottomNav';
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
import { FamilyDashboard } from '../auth/FamilyDashboard';

// * MobileView layout: optimised for one-handed operation and smaller display sizes.
export const MobileView: React.FC<CommonViewProps> = ({
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

      {/* ! Warning: Ensure main body element uses bottom padding clamp so bottom nav overlay does not block scroll. */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-fluid flex flex-col gap-fluid pb-[clamp(5rem,10vw,7rem)]">
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
              className="h-[480px] w-full"
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
          // * Rider Live Cockpit: contains live maps, speedometer telemetry, and group wingmen list.
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
              className="h-[440px] w-full"
            />

            <GroupRidersList participants={currentSession.participants} />
          </div>
        )}
      </main>

      {/* * Modals & Overlays */}
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

      {/* * Bottom navigation bar is rendered fixed at the screen bottom. */}
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
