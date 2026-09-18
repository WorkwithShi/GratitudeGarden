// Reliable, high-fidelity audio system for Shi no Sakura (Mobile & Desktop)
const SOUND_KEY = "shi-no-sakura-sound-enabled";

let ambientAudio = null;
let isAmbientPlaying = false;
let isUnlocked = false;
let audioCtx = null;

export function isSoundEnabled() {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem(SOUND_KEY);
  return saved === null ? true : saved === "true";
}

export function setSoundEnabled(enabled) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SOUND_KEY, String(enabled));
}

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function getAmbientAudio() {
  if (typeof window === "undefined") return null;
  if (!ambientAudio) {
    ambientAudio = new Audio("/sounds/garden-ambience.wav");
    ambientAudio.loop = true;
    ambientAudio.volume = 0.15;
    ambientAudio.preload = "auto";
  }
  return ambientAudio;
}

/**
 * Unlock audio playback on mobile browsers (iOS Safari, Android Chrome).
 * Must be called on direct user interaction (click / touch).
 */
export function unlockAudio() {
  if (isUnlocked) return;
  isUnlocked = true;

  // 1. Resume Web Audio context if suspended
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  } else {
    getAudioContext();
  }

  // 2. If sound is enabled and ambient music should play, start it
  if (isSoundEnabled()) {
    startAmbientMusic();
  }
}

/**
 * Start peaceful Ghibli felt piano background music (calm & quiet).
 */
export function startAmbientMusic() {
  if (!isSoundEnabled()) return;

  const audio = getAmbientAudio();
  if (!audio) return;

  isAmbientPlaying = true;
  audio.volume = 0.15;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked by browser policy; will unlock on first user click/touch
      isAmbientPlaying = false;
    });
  }
}

/**
 * Stop or pause the ambient background music.
 */
export function stopAmbientMusic() {
  isAmbientPlaying = false;
  if (ambientAudio) {
    ambientAudio.pause();
  }
}

/**
 * Play a sweet, delicate Ghibli felt piano blossom note.
 * Plays /sounds/bloom.wav with Web Audio fallback.
 */
export function playBloomSound() {
  if (!isSoundEnabled()) return;

  try {
    const sfx = new Audio("/sounds/bloom.wav");
    sfx.volume = 0.25;
    const p = sfx.play();
    if (p !== undefined) {
      p.catch(() => {
        playBloomFallback();
      });
    }
  } catch {
    playBloomFallback();
  }
}

/**
 * Web Audio synthesizer fallback for Ghibli bloom sound.
 */
function playBloomFallback() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, now);
    filter.connect(ctx.destination);

    // Two sweet ascending music box notes (G5 -> C6)
    [783.99, 1046.50].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const noteTime = now + idx * 0.09;
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.14, noteTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(noteTime);
      osc.stop(noteTime + 0.45);
    });
  } catch (e) {
    console.warn("Audio fallback error:", e);
  }
}

/**
 * Play gentle Ghibli harp shimmer when nourishing a flower.
 */
export function playSparkleSound() {
  if (!isSoundEnabled()) return;

  try {
    const sfx = new Audio("/sounds/sparkle.wav");
    sfx.volume = 0.22;
    const p = sfx.play();
    if (p !== undefined) {
      p.catch(() => {
        playSparkleFallback();
      });
    }
  } catch {
    playSparkleFallback();
  }
}

/**
 * Web Audio synthesizer fallback for sparkle sound.
 */
function playSparkleFallback() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1600, now);
    filter.connect(ctx.destination);

    // 3 delicate ascending notes (C6 -> E6 -> G6)
    [1046.50, 1318.51, 1567.98].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const noteTime = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.15, noteTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(noteTime);
      osc.stop(noteTime + 0.4);
    });
  } catch (e) {
    console.warn("Sparkle fallback error:", e);
  }
}

export function isAmbientMusicActive() {
  return isAmbientPlaying;
}
