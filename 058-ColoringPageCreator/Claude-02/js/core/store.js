/**
 * Central application state + undo/redo.
 *
 * Mutation model
 *   mutate(label, fn)      one undoable change (the snapshot is taken BEFORE fn runs)
 *   beginLive / live / endLive   continuous gestures (drag, resize, colour scrubbing):
 *                           one snapshot at the start, one history entry at the end
 *
 * Events on `bus`: deckLoaded, deck, slide, selection, live, view, zoom, history, dirty
 */
import { Emitter } from './events.js';

export const bus = new Emitter();

export const state = {
  deck: null,
  slideId: null,
  selection: [],
  zoom: 1,
  fit: true,
  dirty: false,
  lastSaved: null, // { time, where: 'dir' | 'local' }
};

const HISTORY_LIMIT = 100;
const undoStack = [];
const redoStack = [];
let liveBefore = null;

const snapshot = () => JSON.stringify({ deck: state.deck, slideId: state.slideId, selection: state.selection });

function restore(json) {
  const snap = JSON.parse(json);
  // View options (mode / colours) are not part of history – keep what the user has now.
  snap.deck.view = state.deck.view;
  state.deck = snap.deck;
  state.slideId = state.deck.slides.some((s) => s.id === snap.slideId) ? snap.slideId : state.deck.slides[0].id;
  state.selection = snap.selection;
  sanitizeSelection();
}

export const activeSlide = () => state.deck?.slides.find((s) => s.id === state.slideId) || null;

function sanitizeSelection() {
  const slide = activeSlide();
  const ids = new Set(slide?.items.map((i) => i.id));
  const next = state.selection.filter((id) => ids.has(id));
  if (next.length !== state.selection.length) state.selection = next;
}

function pushUndo(before) {
  undoStack.push(before);
  if (undoStack.length > HISTORY_LIMIT) undoStack.shift();
  redoStack.length = 0;
}

function markDirty() {
  state.dirty = true;
  bus.emit('dirty');
}

export function loadDeck(deck) {
  state.deck = deck;
  state.slideId = deck.slides[0].id;
  state.selection = [];
  state.dirty = false;
  undoStack.length = 0;
  redoStack.length = 0;
  liveBefore = null;
  bus.emit('deckLoaded');
  bus.emit('deck');
  bus.emit('selection');
  bus.emit('history');
  bus.emit('dirty');
}

export function mutate(label, fn) {
  const before = snapshot();
  const result = fn(state.deck, activeSlide());
  if (result === false) return false;
  pushUndo(before);
  sanitizeSelection();
  markDirty();
  bus.emit('deck', { label });
  bus.emit('selection');
  bus.emit('history');
  return true;
}

export function beginLive() {
  if (liveBefore == null) liveBefore = snapshot();
}

export function live(fn) {
  fn(state.deck, activeSlide());
  bus.emit('live');
}

export function endLive() {
  if (liveBefore == null) return;
  const changed = snapshot() !== liveBefore;
  if (changed) {
    pushUndo(liveBefore);
    markDirty();
  }
  liveBefore = null;
  if (changed) {
    bus.emit('deck');
    bus.emit('history');
  }
}

export const canUndo = () => undoStack.length > 0;
export const canRedo = () => redoStack.length > 0;

function travel(from, to) {
  if (!from.length) return;
  endLive();
  to.push(snapshot());
  restore(from.pop());
  markDirty();
  bus.emit('deck');
  bus.emit('selection');
  bus.emit('history');
}

export const undo = () => travel(undoStack, redoStack);
export const redo = () => travel(redoStack, undoStack);

export function select(ids) {
  const next = [...new Set(ids)];
  if (next.length === state.selection.length && next.every((id, i) => id === state.selection[i])) return;
  state.selection = next;
  bus.emit('selection');
}

export function setActiveSlide(id) {
  if (id === state.slideId || !state.deck.slides.some((s) => s.id === id)) return;
  state.slideId = id;
  state.selection = [];
  bus.emit('slide');
  bus.emit('selection');
}

/** View settings (mode, monochrome colour, canvas background) – saved with the deck but not undoable. */
export function setView(patch) {
  Object.assign(state.deck.view, patch);
  markDirty();
  bus.emit('view');
}

export function setZoom(value, fit = false) {
  state.zoom = value;
  state.fit = fit;
  bus.emit('zoom');
}
