/**
 * Recipe maths and markup: pure functions shared by the game, the gallery loader and the finish screen.
 *
 * A recipe is a list of parts  { block, x, y, sx, sy, rot, flip, fill, label, z }.
 * Every block is drawn on a 100x100 grid centred on (50,50). A part is drawn by centring the block,
 * applying scale and flip, then rotation, then moving it to (x, y).
 */
import { luminance } from '../svg/annotate.js';
import { monochrome } from '../svg/render.js';
import { round } from '../core/util.js';

/** Thinnest outline (in recipe units) a small part may get. */
export const MIN_LINE = 1.2;
export const BLOCK_CENTER = 50;

const FILL = /fill="(#[0-9a-f]{6})"/;

/** First fill that is not (nearly) black = the colour a recipe's `fill` replaces. */
export function mainColor(svg) {
  for (const m of svg.matchAll(/fill="(#[0-9a-f]{6})"/g)) if (luminance(m[1]) >= 0.2) return m[1];
  return null;
}

/**
 * A part is usually a block (100x100 grid, centre 50,50). In the Create game's Advanced mode a part can also
 * be a piece of any gallery object: it carries its own `svg` and `cx`,`cy` (the centre in that svg's own space).
 */
export const partCenter = (part) => (part.svg ? { x: part.cx ?? 0, y: part.cy ?? 0 } : { x: BLOCK_CENTER, y: BLOCK_CENTER });

export const partTransform = (part, at = part) => {
  const c = partCenter(part);
  return `translate(${round(at.x)} ${round(at.y)}) rotate(${round(part.rot || 0)}) scale(${round((part.flip ? -1 : 1) * part.sx, 4)} ${round(part.sy, 4)}) translate(${round(-c.x, 3)} ${round(-c.y, 3)})`;
};

/** Part markup with the recipe's colour overrides and a minimum outline width. */
export function blockBody(part, block, minLine = MIN_LINE) {
  let svg = part.svg || block.svg;
  const main = mainColor(svg);
  if (part.fill && main) svg = svg.replaceAll(`fill="${main}"`, `fill="${String(part.fill).toLowerCase()}"`);
  if (part.line) svg = svg.replace(/stroke="#[0-9a-f]{6}"/g, `stroke="${String(part.line).toLowerCase()}"`);
  const k = Math.sqrt(Math.abs(part.sx * part.sy)) || 1;
  return svg.replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${round(Math.max(Number(w), minLine / k), 2)}"`);
}

export const partMarkup = (part, block, at = part) => `<g transform="${partTransform(part, at)}">${blockBody(part, block)}</g>`;

/** Whole recipe as markup, drawn in z order. Returns null if a block is missing. */
export function composeRecipe(recipe, getBlock) {
  const parts = recipe.map((p, i) => ({ p, i })).sort((a, b) => (a.p.z || 0) - (b.p.z || 0) || a.i - b.i);
  let out = '';
  for (const { p } of parts) {
    const block = p.svg ? null : getBlock(p.block);
    if (!p.svg && !block) return null;
    out += partMarkup(p, block);
  }
  return `<g>${out}</g>`;
}

/** Grey outline of one part: the "slot" the child fills. */
export function slotMarkup(part, block) {
  const body = blockBody(part, block)
    .replace(/fill="#[0-9a-f]{6}"/g, 'fill="#dfe2ee"')
    .replace(/stroke="#[0-9a-f]{6}"/g, 'stroke="#a3a9c4"')
    .replace(/ data-u="[^"]*"/g, '')
    .replace(/ opacity="[^"]*"/g, '');
  return `<g transform="${partTransform(part)}">${body}</g>`;
}

/** A part shown (with its fixed rotation and flip) inside a tray cell: viewBox -62 -62 124 124. */
export function trayThumb(part, block, mode, mono) {
  const size = Math.max(Math.abs(part.sx), Math.abs(part.sy)) * 100 || 100;
  const k = 70 / size;
  const shown = { ...part, sx: part.sx * k, sy: part.sy * k };
  const body = blockBody(part, block, MIN_LINE * 0.9 / Math.max(k, 0.0001));
  const inner = mode === 'uncolored' ? monochrome(body, mono) : body;
  return `<svg viewBox="-62 -62 124 124" xmlns="http://www.w3.org/2000/svg"><g transform="${partTransform(shown, { x: 0, y: 0 })}">${inner}</g></svg>`;
}

/* ---------- facts about a recipe ---------- */

export const blockCounts = (recipe) => {
  const counts = new Map();
  for (const p of recipe) if (p.block) counts.set(p.block, (counts.get(p.block) || 0) + 1);
  return counts;
};

/** easy: 7 parts or fewer, medium: 8–9, hard: 10 or more. */
export const difficultyOf = (partCount) => (partCount <= 7 ? 'easy' : partCount <= 9 ? 'medium' : 'hard');

/** Distance (recipe units) within which a dropped block snaps to its slot. */
export function snapRadius(part, objSize, generous = 1) {
  const size = Math.max(Math.abs(part.sx), Math.abs(part.sy)) * 100;
  return Math.max(objSize * 0.1, size * 0.6) * generous;
}

/** Deterministic shuffle so a puzzle is the same when re-rendered. */
export function shuffled(list, random = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- colour names ---------- */

/** Returns a key such as "blue" (translated through color.name.<key>). */
export function colorKey(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let hue = 0;
  if (d) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue = (hue * 60 + 360) % 360;
  }
  if (l < 0.14) return 'black';
  if (l > 0.92) return 'white';
  if (s < 0.14) return l < 0.62 ? 'gray' : 'white';
  if (hue < 15 || hue >= 345) return l > 0.72 ? 'pink' : 'red';
  if (hue < 42) return l < 0.45 ? 'brown' : 'orange';
  if (hue < 70) return 'yellow';
  if (hue < 165) return 'green';
  if (hue < 200) return 'turquoise';
  if (hue < 255) return 'blue';
  if (hue < 295) return 'purple';
  return 'pink';
}

/** The colour of the biggest part = "the colour of the animal". */
export function dominantColor(recipe, getBlock) {
  let best = null;
  for (const p of recipe) {
    const area = Math.abs(p.sx * p.sy);
    if (!best || area > best.area) best = { area, color: p.fill || mainColor(p.svg || getBlock(p.block)?.svg || '') };
  }
  return best?.color || null;
}
