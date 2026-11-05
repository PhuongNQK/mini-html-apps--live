/**
 * Working Directory – a local folder chosen with the File System Access API
 * (Chromium browsers). The folder handle is remembered in IndexedDB; after a reload the
 * browser may need the user to grant permission again ("pending" state).
 */
import { Emitter } from '../core/events.js';

export const DECK_SUFFIX = '.mcc-deck.json';
const GALLERY_FILE = 'custom-gallery.mcc.json';

const idb = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open('mcc-handles', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('handles');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

async function idbGet(key) {
  try {
    const db = await idb();
    return await new Promise((resolve, reject) => {
      const req = db.transaction('handles').objectStore('handles').get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return undefined;
  }
}

async function idbSet(key, value) {
  try {
    const db = await idb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction('handles', 'readwrite');
      value === undefined ? tx.objectStore('handles').delete(key) : tx.objectStore('handles').put(value, key);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } catch { /* ignore */ }
}

class WorkDir extends Emitter {
  handle = null;
  granted = false;

  get supported() {
    return 'showDirectoryPicker' in window;
  }

  get name() {
    return this.handle?.name || '';
  }

  /** True when files can be written right now. */
  get active() {
    return !!this.handle && this.granted;
  }

  /** A folder is remembered but the browser still needs permission. */
  get pending() {
    return !!this.handle && !this.granted;
  }

  async #permission(request) {
    const opts = { mode: 'readwrite' };
    if ((await this.handle.queryPermission(opts)) === 'granted') return true;
    return request && (await this.handle.requestPermission(opts)) === 'granted';
  }

  async choose() {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite', id: 'magic-color' });
    this.handle = handle;
    this.granted = true;
    await idbSet('dir', handle);
    this.emit('change');
  }

  /** Restores the remembered folder after a page reload. */
  async restore() {
    if (!this.supported) return;
    const handle = await idbGet('dir');
    if (!handle) return;
    this.handle = handle;
    try {
      this.granted = await this.#permission(false);
    } catch {
      this.granted = false;
    }
    this.emit('change');
  }

  /** Called from a user gesture to re-grant access to a remembered folder. */
  async reconnect() {
    if (!this.handle) return false;
    this.granted = await this.#permission(true);
    this.emit('change');
    return this.granted;
  }

  async forget() {
    this.handle = null;
    this.granted = false;
    await idbSet('dir', undefined);
    this.emit('change');
  }

  async listDecks() {
    const out = [];
    for await (const [name, entry] of this.handle.entries()) {
      if (entry.kind !== 'file' || !name.endsWith(DECK_SUFFIX)) continue;
      try {
        const file = await entry.getFile();
        const data = JSON.parse(await file.text());
        const d = data.deck;
        out.push({ file: name, id: d.id, name: d.name, width: d.width, height: d.height, slides: d.slides.length, modified: d.modified || file.lastModified });
      } catch {
        /* unreadable file – skip */
      }
    }
    return out.sort((a, b) => b.modified - a.modified);
  }

  async readText(name) {
    const entry = await this.handle.getFileHandle(name);
    return (await entry.getFile()).text();
  }

  async writeText(name, text) {
    const entry = await this.handle.getFileHandle(name, { create: true });
    const writable = await entry.createWritable();
    await writable.write(text);
    await writable.close();
  }

  async remove(name) {
    await this.handle.removeEntry(name);
  }

  async readGallery() {
    try {
      return await this.readText(GALLERY_FILE);
    } catch {
      return null;
    }
  }

  writeGallery(text) {
    return this.writeText(GALLERY_FILE, text);
  }
}

export const workdir = new WorkDir();
