/**
 * Pure(ish) model operations on a slide's item list. They mutate the objects they are
 * given; callers wrap them in store.mutate() so undo/redo and re-rendering just work.
 */
import { clone, uid } from '../core/util.js';
import { aabb, deg, normalizeAngle, rad, unionRects } from './geometry.js';

export const FILL_RE = /fill="(#[0-9a-f]{6})"/g;
export const STROKE_RE = /stroke="(#[0-9a-f]{6})"/g;

export function createDeck({ name, width, height }) {
  const now = Date.now();
  return {
    id: uid('deck'),
    name,
    width,
    height,
    created: now,
    modified: now,
    view: { mode: 'colored', mono: '#000000', bg: '#ffffff' },
    slides: [createSlide('Slide 1')],
  };
}

export const createSlide = (name) => ({ id: uid('slide'), name, items: [] });

/** Creates a slide item from a gallery item, sized sensibly for the slide. */
export function createObjectItem(galleryItem, deck, name) {
  const { x, y, w, h } = galleryItem.bbox;
  const isBackground = galleryItem.category === 'backgrounds';
  const target = Math.min(deck.width, deck.height) * 0.38;
  const scale = isBackground ? Math.max(deck.width / w, deck.height / h) : target / Math.max(w, h);
  return {
    id: uid('item'),
    type: 'object',
    name,
    galleryId: galleryItem.id,
    svg: galleryItem.svg,
    bx: x,
    by: y,
    bw: w,
    bh: h,
    x: deck.width / 2,
    y: deck.height / 2,
    sx: scale,
    sy: scale,
    rot: 0,
    opacity: 1,
    colorMap: {},
    locked: false,
  };
}

/** Deep copy with fresh ids (also for group children). */
export function cloneItem(item) {
  const copy = clone(item);
  const refresh = (i) => {
    i.id = uid('item');
    i.children?.forEach(refresh);
  };
  refresh(copy);
  return copy;
}

export function duplicateItems(slide, ids, offset = 24) {
  const copies = [];
  for (const item of slide.items.filter((i) => ids.includes(i.id))) {
    const c = cloneItem(item);
    c.x += offset;
    c.y += offset;
    copies.push(c);
  }
  slide.items.push(...copies);
  return copies.map((c) => c.id);
}

export function groupItems(slide, ids) {
  const selected = slide.items.filter((i) => ids.includes(i.id));
  if (selected.length < 2) return null;
  const box = unionRects(selected.map(aabb));
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const children = selected.map((i) => {
    const c = clone(i);
    c.x -= cx;
    c.y -= cy;
    return c;
  });
  const group = {
    id: uid('group'),
    type: 'group',
    name: 'Group',
    children,
    bx: -box.w / 2,
    by: -box.h / 2,
    bw: box.w,
    bh: box.h,
    x: cx,
    y: cy,
    sx: 1,
    sy: 1,
    rot: 0,
    opacity: 1,
    locked: false,
  };
  const topIndex = Math.max(...selected.map((i) => slide.items.indexOf(i)));
  slide.items.splice(topIndex + 1, 0, group);
  slide.items = slide.items.filter((i) => !ids.includes(i.id));
  return group.id;
}

/** Converts a group child into slide space (inverse of groupItems). */
function releaseChild(group, child) {
  const r = rad(group.rot);
  const c = Math.cos(r);
  const s = Math.sin(r);
  const px = child.x * group.sx;
  const py = child.y * group.sy;
  const flipped = group.sx * group.sy < 0;
  child.x = group.x + px * c - py * s;
  child.y = group.y + px * s + py * c;
  child.rot = normalizeAngle(group.rot + (flipped ? -child.rot : child.rot));
  child.sx *= group.sx;
  child.sy *= group.sy;
  child.opacity = (child.opacity ?? 1) * (group.opacity ?? 1);
  return child;
}

export function ungroupItems(slide, ids) {
  const released = [];
  const result = [];
  for (const item of slide.items) {
    if (ids.includes(item.id) && item.type === 'group') {
      const kids = item.children.map((child) => releaseChild(item, clone(child)));
      result.push(...kids);
      released.push(...kids.map((k) => k.id));
    } else result.push(item);
  }
  slide.items = result;
  return released;
}

export function reorder(slide, ids, mode) {
  const items = slide.items;
  const isSel = (i) => ids.includes(i.id);
  if (mode === 'front') slide.items = [...items.filter((i) => !isSel(i)), ...items.filter(isSel)];
  else if (mode === 'back') slide.items = [...items.filter(isSel), ...items.filter((i) => !isSel(i))];
  else if (mode === 'forward') {
    for (let i = items.length - 2; i >= 0; i--) if (isSel(items[i]) && !isSel(items[i + 1])) [items[i], items[i + 1]] = [items[i + 1], items[i]];
  } else if (mode === 'backward') {
    for (let i = 1; i < items.length; i++) if (isSel(items[i]) && !isSel(items[i - 1])) [items[i], items[i - 1]] = [items[i - 1], items[i]];
  }
}

export function flip(item, axis) {
  if (axis === 'h') item.sx = -item.sx;
  else item.sy = -item.sy;
  item.rot = normalizeAngle(-item.rot);
}

/* ---------- colours ---------- */

/** Distinct original fill colours of an item, in drawing order. */
export function itemColors(item, out = new Map()) {
  if (item.type === 'group') item.children.forEach((c) => itemColors(c, out));
  else {
    for (const m of item.svg.matchAll(FILL_RE)) {
      const orig = m[1];
      if (!out.has(orig)) out.set(orig, item.colorMap?.[orig] || orig);
    }
  }
  return out;
}

/** Sets the replacement for one original colour (or all colours when orig is null). */
export function recolorItem(item, orig, color) {
  if (item.type === 'group') return item.children.forEach((c) => recolorItem(c, orig, color));
  item.colorMap ||= {};
  const targets = orig ? [orig] : [...itemColors(item).keys()];
  for (const o of targets) if (item.svg.includes(`fill="${o}"`)) item.colorMap[o] = color;
}

/** Distinct original line (stroke) colours of an item, in drawing order. */
export function itemLineColors(item, out = new Map()) {
  if (item.type === 'group') item.children.forEach((c) => itemLineColors(c, out));
  else {
    for (const m of item.svg.matchAll(STROKE_RE)) {
      const orig = m[1];
      if (!out.has(orig)) out.set(orig, item.lineMap?.[orig] || orig);
    }
  }
  return out;
}

/** Sets the replacement for one original line colour (or all line colours when orig is null). */
export function recolorLine(item, orig, color) {
  if (item.type === 'group') return item.children.forEach((c) => recolorLine(c, orig, color));
  item.lineMap ||= {};
  const targets = orig ? [orig] : [...itemLineColors(item).keys()];
  for (const o of targets) if (item.svg.includes(`stroke="${o}"`)) item.lineMap[o] = color;
}

export function resetColors(item) {
  if (item.type === 'group') item.children.forEach(resetColors);
  else {
    item.colorMap = {};
    item.lineMap = {};
  }
}

export { deg };
