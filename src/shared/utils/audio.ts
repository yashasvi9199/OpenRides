/**
 * Web Audio API synthesizer for safety alerts, SOS sirens, and tactile UI feedback.
 * Operates without external audio assets.
 */

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

/**
 * Play a short alert beep (e.g. countdown, check-in ping)
 */
export const playBeep = (freq: number = 880, durationMs: number = 150, type: OscillatorType = 'sine'): void => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch (e) {
    console.debug('Audio playback suppressed', e);
  }
};

/**
 * Play loud two-tone emergency siren
 */
let sirenInterval: any = null;

export const startEmergencySiren = (): void => {
  if (sirenInterval) return;
  let toggle = false;
  
  // Immediate first tone
  playBeep(960, 280, 'sawtooth');
  
  sirenInterval = setInterval(() => {
    toggle = !toggle;
    playBeep(toggle ? 960 : 720, 280, 'sawtooth');
  }, 350);
};

export const stopEmergencySiren = (): void => {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
};

/**
 * Play positive confirmation chime (e.g. rider approved, ride started)
 */
export const playSuccessChime = (): void => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      setTimeout(() => {
        playBeep(freq, 120, 'sine');
      }, i * 90);
    });
  } catch (e) {
    console.debug('Chime error', e);
  }
};
