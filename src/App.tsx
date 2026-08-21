import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from './features/auth/authStore';
import { useRideStore } from './features/ride/rideStore';
import { ToastProvider, useToast } from './shared/components/Toast';
import { PublicEmergencyView } from './features/sos/PublicEmergencyView';
import { DesktopView } from './features/views/DesktopView';
import { MobileView } from './features/views/MobileView';

const MainAppContent: React.FC = () => {
  // * Connect to global store slices for authentication details and live session tracking.
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

  // ? Should these local states be migrated to a UI slice in Zustand later?
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPublicEmergencyViewActive, setIsPublicEmergencyViewActive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // * Listen to viewport resize. Keeps Desktop vs Mobile views dynamically synced.
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

  // ! Alert: Handles direct URL navigation for SOS QR scans before loading dashboard.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/sos/')) {
        setIsPublicEmergencyViewActive(true);
      }
    }
  }, []);

  // * Switch user roles and dispatch toast messages to inform screen transition.
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

  // * Render the unauthenticated guest view if we are on a direct SOS QR link.
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

  // * Render either DesktopView or MobileView based on the tracked viewport width.
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
