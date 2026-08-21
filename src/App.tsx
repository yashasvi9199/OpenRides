import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from './features/auth/authStore';
import { useRideStore } from './features/ride/rideStore';
import { ToastProvider, useToast } from './shared/components/Toast';
import { PublicEmergencyView } from './features/sos/PublicEmergencyView';
import { DesktopView } from './features/views/DesktopView';
import { MobileView } from './features/views/MobileView';

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
  const [isDesktop, setIsDesktop] = useState(true);

  // Resize listener for viewport tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 640);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

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

  const commonProps = {
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
  };

  return isDesktop ? (
    <DesktopView {...commonProps} />
  ) : (
    <MobileView {...commonProps} />
  );
};

export default function App() {
  return (
    <ToastProvider>
      <MainAppContent />
    </ToastProvider>
  );
}
