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

/* ---------- narration voices ---------- */

const RATE_KEY = 'game.voiceRate';
const VOICE_KEY = 'game.voice';
let chosenVoice = local.get(VOICE_KEY, null); // voiceURI, or null = automatic
let rate = Number(local.get(RATE_KEY, 0.92)) || 0.92;

const synth = () => ('speechSynthesis' in window ? window.speechSynthesis : null);

/** Voices installed on this device (they may load a moment after the page starts). */
export function listVoices() {
  const s = synth();
  if (!s) return Promise.resolve([]);
  const now = s.getVoices();
  if (now.length) return Promise.resolve(now);
  return new Promise((resolve) => {
    const done = () => resolve(s.getVoices());
    s.addEventListener?.('voiceschanged', done, { once: true });
    setTimeout(done, 1200);
  });
}

export const getVoiceChoice = () => ({ voiceURI: chosenVoice, rate });

export function setVoiceChoice({ voiceURI = chosenVoice, rate: r = rate }) {
  chosenVoice = voiceURI || null;
  rate = Math.min(1.4, Math.max(0.6, Number(r) || 0.92));
  local.set(VOICE_KEY, chosenVoice);
  local.set(RATE_KEY, rate);
}

/** The chosen voice if it is still installed, otherwise the best match for the app language. */
function pickVoice() {
  const voices = synth()?.getVoices() || [];
  const chosen = chosenVoice && voices.find((v) => v.voiceURI === chosenVoice);
  return chosen || null;
}

/** Reads text aloud (silently does nothing when unsupported or muted). `force` ignores the sound switch (voice test). */
export function speak(text, { force = false } = {}) {
  if ((!enabled && !force) || !text || !synth()) return;
  try {
    synth().cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else u.lang = getLanguage() || 'en';
    u.rate = rate;
    u.pitch = 1.15;
    synth().speak(u);
  } catch {
    /* narration is optional */
  }
}

export const stopSpeaking = () => {
  try {
    synth()?.cancel();
  } catch {
    /* ignore */
  }
};
