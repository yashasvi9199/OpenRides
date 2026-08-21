// * Capacitor utilities: native device bridging.
/**
 * Safety & Platform Guardrails for Web & Capacitor Hybrid Mobile deployments.
 * Prevents browser execution crashes when plugins or native hardware APIs are absent.
 */

// Simulated Capacitor global object check
export const isCapacitorNative = (): boolean => {
  if (typeof window === 'undefined') return false;
  // Check standard Capacitor globals
  const win = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } };
  try {
    return !!(win.Capacitor && win.Capacitor.isNativePlatform && win.Capacitor.isNativePlatform());
  } catch {
    return false;
  }
};

/**
 * Screen WakeLock safety wrapper to keep mobile screen alive during rides.
 */
let wakeLockSentinel: any = null;

export const requestScreenWakeLock = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('wakeLock' in navigator)) {
    return false;
  }
  try {
    wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
    wakeLockSentinel.addEventListener('release', () => {
      wakeLockSentinel = null;
    });
    return true;
  } catch (err) {
    console.debug('Wake lock request skipped or denied in browser context', err);
    return false;
  }
};

export const releaseScreenWakeLock = async (): Promise<void> => {
  try {
    if (wakeLockSentinel && typeof wakeLockSentinel.release === 'function') {
      await wakeLockSentinel.release();
      wakeLockSentinel = null;
    }
  } catch (err) {
    console.debug('Wake lock release error', err);
  }
};

/**
 * Safe Vibration wrapper for haptic alerts during crashes or check-ins.
 */
export const triggerSafeHaptic = (pattern: number | number[] = [200, 100, 200]): void => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  }
};

/**
 * Safe Battery level checker.
 */
export const getBatteryLevelSafe = async (): Promise<number> => {
  if (typeof window !== 'undefined' && 'getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      return Math.round(battery.level * 100);
    } catch {
      return 88; // Sensible default fallback
    }
  }
  return 92;
};
