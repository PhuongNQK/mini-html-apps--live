/**
 * Editing commands. Every user action (buttons, shortcuts, drag & drop) goes through here,
 * so behaviour is defined once and is always undoable.
 */
import { state, mutate, activeSlide, select, setActiveSlide, setView } from '../core/store.js';
import { clone, uid, clamp } from '../core/util.js';
import { gallery } from '../services/gallery.js';
import { createObjectItem, createSlide, duplicateItems, flip, groupItems, recolorItem, reorder, resetColors, ungroupItems } from '../model/ops.js';
import { normalizeAngle, aabb, unionRects } from '../model/geometry.js';
import { itemMarkup } from '../svg/render.js';
import { luminance } from '../svg/annotate.js';
import { itemColors } from '../model/ops.js';
import { cloneItem } from '../model/ops.js';

export const selectedItems = () => activeSlide().items.filter((i) => state.selection.includes(i.id));
const hasSelection = () => state.selection.length > 0;

/* ---------- objects ---------- */

/** Adds a gallery item to the current slide (optionally at a slide position). */
export function addFromGallery(galleryId, at) {
  const g = gallery.get(galleryId);
  if (!g) return;
  mutate('add', (deck, slide) => {
    const item = createObjectItem(g, deck, gallery.displayName(g));
    if (at) Object.assign(item, { x: at.x, y: at.y });
    else {
      const offset = (slide.items.filter((i) => i.type).length % 6) * 22;
      item.x += offset;
      item.y += offset;
    }
    if (g.category === 'backgrounds') slide.items.unshift(item);
    else slide.items.push(item);
    state.selection = [item.id];
  });
}

export function removeSelected() {
  if (!hasSelection()) return;
  mutate('delete', (deck, slide) => {
    slide.items = slide.items.filter((i) => !state.selection.includes(i.id));
    state.selection = [];
  });
}

/** Deletes one specific layer (used by the delete button in the Layers list). */
export function removeItem(id) {
  mutate('delete', (deck, slide) => {
    if (!slide.items.some((i) => i.id === id)) return false;
    slide.items = slide.items.filter((i) => i.id !== id);
    state.selection = state.selection.filter((s) => s !== id);
  });
}

export function duplicateSelected() {
  if (!hasSelection()) return;
  mutate('duplicate', (deck, slide) => {
    state.selection = duplicateItems(slide, state.selection);
  });
}

export function groupSelected() {
  if (state.selection.length < 2) return;
  mutate('group', (deck, slide) => {
    const id = groupItems(slide, state.selection);
    if (!id) return false;
    state.selection = [id];
  });
}

export function ungroupSelected() {
  if (!selectedItems().some((i) => i.type === 'group')) return;
  mutate('ungroup', (deck, slide) => {
    const released = ungroupItems(slide, state.selection);
    state.selection = [...state.selection.filter((id) => !released.length || slide.items.some((i) => i.id === id)), ...released];
  });
}

export function layer(mode) {
  if (!hasSelection()) return;
  mutate('layer', (deck, slide) => reorder(slide, state.selection, mode));
}

export function flipSelected(axis) {
  if (!hasSelection()) return;
  mutate('flip', () => selectedItems().forEach((i) => flip(i, axis)));
}

export function rotateSelected(degrees) {
  if (!hasSelection()) return;
  mutate('rotate', () => selectedItems().forEach((i) => (i.rot = normalizeAngle(i.rot + degrees))));
}

export function nudge(dx, dy) {
  if (!hasSelection()) return;
  mutate('move', () => selectedItems().forEach((i) => !i.locked && ((i.x += dx), (i.y += dy))));
}

export function selectAll() {
  select(activeSlide().items.filter((i) => !i.locked).map((i) => i.id));
}

export function renameItem(id, name) {
  mutate('rename', (deck, slide) => {
    const item = slide.items.find((i) => i.id === id);
    if (!item || !name.trim()) return false;
    item.name = name.trim();
  });
}

export function toggleLock(id) {
  mutate('lock', (deck, slide) => {
    const item = slide.items.find((i) => i.id === id);
    if (item) item.locked = !item.locked;
  });
}

/** Applies a numeric property from the properties panel. */
export function setProperty(field, value) {
  const items = selectedItems();
  if (!items.length || !Number.isFinite(value)) return;
  mutate('property', () => {
    for (const i of items) {
      if (field === 'x' || field === 'y') i[field] = value;
      else if (field === 'rot') i.rot = normalizeAngle(value);
      else if (field === 'opacity') i.opacity = clamp(value, 0, 1);
      else if (field === 'w') i.sx = (Math.sign(i.sx) || 1) * (Math.max(value, 1) / i.bw);
      else if (field === 'h') i.sy = (Math.sign(i.sy) || 1) * (Math.max(value, 1) / i.bh);
    }
  });
}

/* ---------- colours ---------- */

/** orig = original colour to replace, or null for "all colours". */
export function recolorSelected(orig, color) {
  recolorItems(selectedItems(), orig, color);
}

function recolorItems(items, orig, color) {
  items.forEach((i) => recolorItem(i, orig, color));
}

export const resetSelectedColors = () => mutate('colors', () => selectedItems().forEach(resetColors));

/* ---------- gallery ---------- */

/** Bakes the selection (one item, a group, or several items) into standalone SVG markup. */
export function selectionMarkup() {
  const items = selectedItems();
  if (!items.length) return null;
  const ctx = { mode: 'colored', mono: '#000000' };
  if (items.length === 1) {
    const copy = clone(items[0]);
    copy.x = 0;
    copy.y = 0;
    return itemMarkup(copy, ctx);
  }
  const box = unionRects(items.map(aabb));
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  return items
    .map((i) => {
      const c = clone(i);
      c.x -= cx;
      c.y -= cy;
      return itemMarkup(c, ctx);
    })
    .join('');
}

export function saveSelectionToGallery(name) {
  const svg = selectionMarkup();
  if (!svg) return null;
  return gallery.addCustom({ name, svg });
}

/* ---------- slides ---------- */

export function addSlide() {
  mutate('addSlide', (deck) => {
    const slide = createSlide(`Slide ${deck.slides.length + 1}`);
    deck.slides.splice(deck.slides.findIndex((s) => s.id === state.slideId) + 1, 0, slide);
    state.slideId = slide.id;
    state.selection = [];
  });
}

export function duplicateSlide() {
  mutate('duplicateSlide', (deck, slide) => {
    const copy = { id: uid('slide'), name: `${slide.name} (copy)`, items: slide.items.map(cloneItem) };
    deck.slides.splice(deck.slides.indexOf(slide) + 1, 0, copy);
    state.slideId = copy.id;
    state.selection = [];
  });
}

export function deleteSlide() {
  if (state.deck.slides.length <= 1) return;
  mutate('deleteSlide', (deck, slide) => {
    const index = deck.slides.indexOf(slide);
    deck.slides.splice(index, 1);
    state.slideId = deck.slides[Math.min(index, deck.slides.length - 1)].id;
    state.selection = [];
  });
}

/**
 * Puts a built object on a slide as ONE merged object with its fills removed (light fills become white),
 * ready to be coloured in. Uses the current slide when it is empty, otherwise adds a new slide after it.
 * @param {{svg:string, bbox:object, category?:string}} source  a prepared gallery item or composed object
 */
export function addColoringPage(source, name) {
  mutate('addColoringPage', (deck, slide) => {
    let target = slide;
    if (slide.items.length) {
      target = createSlide(name);
      deck.slides.splice(deck.slides.indexOf(slide) + 1, 0, target);
      state.slideId = target.id;
    } else slide.name = name;
    const item = createObjectItem({ ...source, category: 'props' }, deck, name);
    const fit = (0.8 * Math.min(deck.width, deck.height)) / Math.max(item.bw, item.bh);
    item.sx = item.sy = fit;
    for (const [orig] of itemColors(item)) if (luminance(orig) > 0.35) item.colorMap[orig] = '#ffffff';
    target.items.push(item);
    state.selection = [item.id];
  });
}

export function renameSlide(id, name) {
  mutate('renameSlide', (deck) => {
    const slide = deck.slides.find((s) => s.id === id);
    if (!slide || !name.trim()) return false;
    slide.name = name.trim();
  });
}

export function moveSlide(delta) {
  mutate('moveSlide', (deck, slide) => {
    const from = deck.slides.indexOf(slide);
    const to = from + delta;
    if (to < 0 || to >= deck.slides.length) return false;
    deck.slides.splice(from, 1);
    deck.slides.splice(to, 0, slide);
  });
}

export { setActiveSlide, setView };
