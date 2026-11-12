/** Reading / writing the custom deck file format (JSON). */
import { uid } from '../core/util.js';
import { sanitizeMarkup } from '../svg/annotate.js';
import { cleanText, textSvg } from '../model/text.js';

export const DECK_FORMAT = 'magic-color-deck';
export const DECK_VERSION = 1;

export const serializeDeck = (deck) => JSON.stringify({ format: DECK_FORMAT, version: DECK_VERSION, deck });

const num = (v, fallback) => (Number.isFinite(Number(v)) ? Number(v) : fallback);

function cleanItem(raw) {
  const item = {
    id: String(raw.id || uid('item')),
    type: raw.type === 'group' ? 'group' : 'object',
    name: String(raw.name || 'Object'),
    bx: num(raw.bx, 0), by: num(raw.by, 0), bw: Math.max(num(raw.bw, 100), 0.01), bh: Math.max(num(raw.bh, 100), 0.01),
    x: num(raw.x, 0), y: num(raw.y, 0),
    sx: num(raw.sx, 1) || 1, sy: num(raw.sy, 1) || 1,
    rot: num(raw.rot, 0),
    opacity: Math.min(1, Math.max(0, num(raw.opacity, 1))),
    locked: !!raw.locked,
  };
  if (item.type === 'group') {
    item.children = (Array.isArray(raw.children) ? raw.children : []).map(cleanItem);
  } else {
    item.galleryId = raw.galleryId || null;
    // Text items regenerate their markup from the text description (never trust stored markup for them).
    if (raw.text && typeof raw.text === 'object') {
      item.text = cleanText(raw.text);
      item.svg = textSvg(item.text, { w: item.bw, h: item.bh });
    } else item.svg = sanitizeMarkup(String(raw.svg || ''));
    for (const field of ['colorMap', 'lineMap']) {
      item[field] = {};
      for (const [k, v] of Object.entries(raw[field] || {})) {
        if (/^#[0-9a-f]{6}$/i.test(k) && /^#[0-9a-f]{6}$/i.test(v)) item[field][k.toLowerCase()] = v.toLowerCase();
      }
    }
  }
  return item;
}

/**
 * Validates and normalises a deck file. Throws Error('invalid') for anything unusable.
 * @param {string} text
 * @param {{newId?:boolean}} opts  newId: give the deck a fresh id (used when importing copies)
 */
export function parseDeck(text, { newId = false } = {}) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('invalid');
  }
  const d = data?.format === DECK_FORMAT ? data.deck : null;
  if (!d || !Array.isArray(d.slides) || !d.slides.length) throw new Error('invalid');
  const width = num(d.width, 0);
  const height = num(d.height, 0);
  if (width < 16 || height < 16 || width > 20000 || height > 20000) throw new Error('invalid');

  return {
    id: newId || !d.id ? uid('deck') : String(d.id),
    name: String(d.name || 'Imported project'),
    width,
    height,
    created: num(d.created, Date.now()),
    modified: num(d.modified, Date.now()),
    view: {
      mode: d.view?.mode === 'uncolored' ? 'uncolored' : 'colored',
      mono: /^#[0-9a-f]{6}$/i.test(d.view?.mono) ? d.view.mono : '#000000',
      bg: /^#[0-9a-f]{6}$/i.test(d.view?.bg) ? d.view.bg : '#ffffff',
    },
    slides: d.slides.map((s, i) => ({
      id: String(s.id || uid('slide')),
      name: String(s.name || `Slide ${i + 1}`),
      items: (Array.isArray(s.items) ? s.items : []).map(cleanItem),
    })),
  };
}

/** File name used inside the Working Directory. */
export const deckFileName = (deck, slugFn) => `${slugFn(deck.name)}-${deck.id.slice(-6)}.mcc-deck.json`;
