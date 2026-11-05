/** localStorage wrappers: key/value helpers and the local "drafts" store for projects. */
const PREFIX = 'mcc.';

export const local = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn('localStorage write failed', err);
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch { /* ignore */ }
  },
};

const INDEX_KEY = 'deckIndex';
const deckKey = (id) => `deck.${id}`;

const meta = (deck) => ({
  id: deck.id,
  name: deck.name,
  width: deck.width,
  height: deck.height,
  slides: deck.slides.length,
  modified: deck.modified,
});

/** Projects saved in this browser (Local Storage). */
export const drafts = {
  list() {
    return (local.get(INDEX_KEY, []) || []).sort((a, b) => b.modified - a.modified);
  },
  save(deck) {
    if (!local.set(deckKey(deck.id), deck)) return false;
    const index = local.get(INDEX_KEY, []).filter((m) => m.id !== deck.id);
    index.push(meta(deck));
    return local.set(INDEX_KEY, index);
  },
  load(id) {
    return local.get(deckKey(id));
  },
  remove(id) {
    local.remove(deckKey(id));
    local.set(INDEX_KEY, local.get(INDEX_KEY, []).filter((m) => m.id !== id));
  },
};
