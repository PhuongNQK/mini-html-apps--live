/** Game sound effects (Web Audio, no files) and spoken narration (speech synthesis). One switch controls both. */
import { local } from '../services/storage.js';
import { getLanguage } from '../core/i18n.js';

let ctx = null;
let enabled = local.get('game.sound', true) !== false;

const audio = () => {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

function tone(freq, start, dur, { type = 'sine', gain = 0.18, to = null } = {}) {
  const c = audio();
  if (!c || !enabled) return;
  const o = c.createOscillator();
  const g = c.createGain();
  const t0 = c.currentTime + start;
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

export const sound = {
  get on() {
    return enabled;
  },
  toggle() {
    enabled = !enabled;
    local.set('game.sound', enabled);
    if (!enabled) speechSynthesis?.cancel?.();
    return enabled;
  },
  /** A block lands in its slot. */
  snap() {
    tone(520, 0, 0.12, { type: 'triangle', to: 780 });
    tone(1040, 0.08, 0.16, { type: 'sine', gain: 0.1 });
  },
  pick() {
    tone(380, 0, 0.07, { type: 'triangle', gain: 0.08 });
  },
  oops() {
    tone(260, 0, 0.18, { type: 'sawtooth', gain: 0.07, to: 180 });
  },
  win() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.13, 0.28, { type: 'triangle', gain: 0.16 }));
    tone(1318, 0.55, 0.5, { type: 'sine', gain: 0.12 });
  },
};

/** Reads text aloud in the app language (silently does nothing when unsupported or muted). */
export function speak(text) {
  if (!enabled || !text || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = getLanguage() || 'en';
    u.rate = 0.92;
    u.pitch = 1.15;
    speechSynthesis.speak(u);
  } catch {
    /* narration is optional */
  }
}

export const stopSpeaking = () => {
  try {
    speechSynthesis?.cancel?.();
  } catch {
    /* ignore */
  }
};
