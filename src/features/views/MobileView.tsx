import React from 'react';
import { CommonViewProps } from './views.types';
import { Navbar } from '../../shared/components/Navbar';
import { BottomNav } from '../../shared/components/BottomNav';
import { LiveRideMap } from '../map/LiveRideMap';
import { LiveTelemetryOverlay } from '../ride/LiveTelemetryOverlay';
import { RideController } from '../ride/RideController';
import { GroupRidersList } from '../ride/GroupRidersList';
import { GroupRiderApprovalModal } from '../ride/GroupRiderApprovalModal';
import { CrashDetectionBanner } from '../ride/CrashDetectionBanner';
import { EmergencyQRModal, EmergencyQRModalContent } from '../sos/EmergencyQRModal';
import { MedicalProfileEditor } from '../sos/MedicalProfileEditor';
import { RideHistoryModal, RideHistoryModalContent } from '../ride/RideHistoryModal';
import { GroupRideModal, GroupRideModalContent } from '../ride/GroupRideModal';
import { FamilyDashboard } from '../auth/FamilyDashboard';
import { Card } from '../../shared/components/Card';
import { History, Users, QrCode } from 'lucide-react';

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
        ) : activeView === 'group' ? (
          // * Inline Group Sync Page View (replacing popup modal)
          <div className="flex flex-col gap-fluid">
            <Card className="p-fluid">
              <GroupRideModalContent
                rideCode={currentSession.code}
                onJoinCodeSubmit={joinGroupWithCode}
                onSimulateIncomingRequest={createJoinRequestSimulation}
              />
            </Card>
          </div>
        ) : activeView === 'sos' ? (
          // * Inline Helmet QR sticker badge View (replacing popup modal)
          <div className="flex flex-col gap-fluid">
            <Card className="p-fluid">
              <EmergencyQRModalContent
                user={user}
                onOpenPublicView={() => setIsPublicEmergencyViewActive(true)}
              />
            </Card>
          </div>
        ) : activeView === 'history' ? (
          // * Inline Ride History logs Page View (replacing popup modal)
          <div className="flex flex-col gap-fluid">
            <Card className="p-fluid">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
                <History className="w-5 h-5 text-cyan-600" />
                <h2 className="text-lg font-bold text-slate-900">Ride History & Telemetry Logs</h2>
              </div>
              <RideHistoryModalContent history={history} />
            </Card>
          </div>
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
              onOpenGroupModal={() => setActiveView('group')}
              onTriggerSOS={triggerSOS}
              onDismissSOS={dismissSOS}
              onSimulateCrash={triggerSimulatedCrash}
              onOpenHistory={() => setActiveView('history')}
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

      {/* * Bottom navigation bar is rendered fixed at the screen bottom. */}
      <BottomNav
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
        }}
        pendingRequestCount={pendingRequests.length}
      />
    </div>
  );
};
