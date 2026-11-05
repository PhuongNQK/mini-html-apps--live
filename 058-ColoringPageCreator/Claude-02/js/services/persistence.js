/**
 * Saving and loading projects: Working Directory when available, Local Storage otherwise.
 * Also owns the auto-save timer (default every 2 minutes).
 */
import { bus, state, loadDeck } from '../core/store.js';
import { local, drafts } from './storage.js';
import { workdir } from './workdir.js';
import { gallery } from './gallery.js';
import { deckFileName, parseDeck, serializeDeck } from './deckFile.js';
import { slug } from '../core/util.js';

const LAST_KEY = 'last';
const fileByDeck = new Map(); // deck id -> file name currently used in the working directory

/** Saves the open project. Resolves with where it went: 'dir' | 'local' | null (failed). */
export async function saveNow() {
  const deck = state.deck;
  if (!deck) return null;
  deck.modified = Date.now();
  let where = 'local';

  if (workdir.active) {
    try {
      const name = deckFileName(deck, slug);
      await workdir.writeText(name, serializeDeck(deck));
      const previous = fileByDeck.get(deck.id);
      if (previous && previous !== name) await workdir.remove(previous).catch(() => {});
      fileByDeck.set(deck.id, name);
      where = 'dir';
    } catch (err) {
      console.warn('Working directory save failed, falling back to local storage', err);
    }
  }
  if (where === 'local' && !drafts.save(deck)) {
    bus.emit('saveError');
    return null;
  }
  // Always keep a tiny pointer so the next visit reopens this project.
  local.set(LAST_KEY, { id: deck.id, where, file: fileByDeck.get(deck.id) || null });
  state.dirty = false;
  state.lastSaved = { time: Date.now(), where };
  bus.emit('dirty');
  bus.emit('saved');
  return where;
}

/** Opens a project stored in the Working Directory. */
export async function openFromDir(file) {
  const deck = parseDeck(await workdir.readText(file));
  fileByDeck.set(deck.id, file);
  loadDeck(deck);
  local.set(LAST_KEY, { id: deck.id, where: 'dir', file });
}

export function openFromLocal(id) {
  const raw = drafts.load(id);
  if (!raw) throw new Error('missing');
  const deck = parseDeck(JSON.stringify({ format: 'magic-color-deck', version: 1, deck: raw }));
  loadDeck(deck);
  local.set(LAST_KEY, { id: deck.id, where: 'local' });
}

export async function deleteDirFile(file) {
  await workdir.remove(file);
  for (const [id, f] of fileByDeck) if (f === file) fileByDeck.delete(id);
}

/** Reopens whatever was open last time. Resolves false when there is nothing to restore. */
export async function restoreLast() {
  const last = local.get(LAST_KEY);
  if (!last) return false;
  try {
    if (last.where === 'dir' && workdir.active && last.file) await openFromDir(last.file);
    else if (drafts.load(last.id)) openFromLocal(last.id);
    else return false;
    return true;
  } catch (err) {
    console.warn('Could not restore the last project', err);
    return false;
  }
}

/** Marks a freshly created / imported deck as needing a save. */
export function markUnsaved() {
  state.dirty = true;
  bus.emit('dirty');
}

export function startAutosave(seconds) {
  setInterval(() => {
    if (state.dirty) saveNow();
  }, seconds * 1000);

  // Safety net: when the tab is hidden or closed, keep a local copy of unsaved work.
  const flush = () => {
    if (state.dirty && state.deck) drafts.save(state.deck);
  };
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flush());
  window.addEventListener('pagehide', flush);

  // Mirror custom gallery items into the Working Directory.
  gallery.on('userChange', () => gallery.syncToWorkdir());
}
