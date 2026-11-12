/**
 * Text items. A text item is an ordinary "object" item (so move/scale/rotate/opacity/groups/clipboard
 * all work) that also carries a `text` description. Its `svg` is generated from that description, with
 * explicit fill/stroke attributes, so the existing colour tools (fill and line colours) work unchanged.
 *
 *   item.text = { content, font, size, bold, italic, underline, strike, align, strokeW }
 */
import { uid } from '../core/util.js';
import { DEFAULT_FONT, fontById } from '../data/fonts.js';

export const TEXT_FILL = '#2b2d42';
export const TEXT_STROKE = '#2b2d42';
const LINE = 1.2; // line height (em)

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clampNum = (v, lo, hi, d) => (Number.isFinite(Number(v)) ? Math.min(hi, Math.max(lo, Number(v))) : d);

export function cleanText(raw = {}) {
  return {
    content: String(raw.content ?? '').slice(0, 2000),
    font: fontById(raw.font).id,
    size: clampNum(raw.size, 4, 1000, 48),
    bold: !!raw.bold,
    italic: !!raw.italic,
    underline: !!raw.underline,
    strike: !!raw.strike,
    align: ['left', 'center', 'right'].includes(raw.align) ? raw.align : 'center',
    strokeW: clampNum(raw.strokeW, 0, 60, 0),
  };
}

const fontShorthand = (t) => `${t.italic ? 'italic ' : ''}${t.bold ? 700 : 400} ${t.size}px ${fontById(t.font).css}`;

let ctx = null;
/** Natural size of the text block in slide units. */
export function measureText(t) {
  ctx ||= document.createElement('canvas').getContext('2d');
  ctx.font = fontShorthand(t);
  const lines = t.content.split('\n');
  const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
  return { w: Math.max(widest + t.size * 0.12, t.size * 0.6), h: lines.length * t.size * LINE };
}

/** Resolves when the font is ready to measure (web fonts load on first use). */
export const ensureFont = (t) => (document.fonts?.load ? document.fonts.load(fontShorthand(t), t.content || 'A').catch(() => {}) : Promise.resolve());

/** Inner SVG markup of a text item, centred on (0,0). */
export function textSvg(t, { w, h } = measureText(t)) {
  const lines = t.content.split('\n');
  const anchor = { left: 'start', center: 'middle', right: 'end' }[t.align];
  const x = { left: -w / 2 + t.size * 0.06, center: 0, right: w / 2 - t.size * 0.06 }[t.align];
  const deco = [t.underline && 'underline', t.strike && 'line-through'].filter(Boolean).join(' ');
  const tspans = lines.map((l, i) => `<tspan x="${+x.toFixed(2)}" y="${+(-h / 2 + (i + 0.5) * t.size * LINE + t.size * 0.33).toFixed(2)}">${esc(l)}</tspan>`).join('');
  // In "Uncolored" mode letters become hollow outlines, ready to be coloured in.
  const hollow = `fill:#ffffff;stroke:@M;stroke-width:${Math.max(1.2, +(t.size * 0.04).toFixed(2))}px`;
  return `<rect x="${+(-w / 2).toFixed(2)}" y="${+(-h / 2).toFixed(2)}" width="${+w.toFixed(2)}" height="${+h.toFixed(2)}" fill="transparent"/>`
    + `<text font-family="${esc(fontById(t.font).css)}" font-size="${t.size}" font-weight="${t.bold ? 700 : 400}" font-style="${t.italic ? 'italic' : 'normal'}"`
    + `${deco ? ` text-decoration="${deco}"` : ''} text-anchor="${anchor}" fill="${TEXT_FILL}" stroke="${TEXT_STROKE}" stroke-width="${t.strokeW}" stroke-linejoin="round" paint-order="stroke" data-u="${hollow}" xml:space="preserve">${tspans}</text>`;
}

/** Recomputes the generated svg and natural box of a text item (its centre and scale stay put). */
export function rebuildText(item) {
  const size = measureText(item.text);
  item.svg = textSvg(item.text, size);
  Object.assign(item, { bx: -size.w / 2, by: -size.h / 2, bw: size.w, bh: size.h });
  return item;
}

const nameFor = (content) => `Text: ${content.split('\n')[0].trim().slice(0, 24) || '…'}`;

/** Changes some text properties of an item. */
export function applyText(item, patch) {
  const autoName = !item.name || item.name.startsWith('Text');
  item.text = cleanText({ ...item.text, ...patch });
  rebuildText(item);
  if (autoName) item.name = nameFor(item.text.content);
  return item;
}

export function createTextItem(deck, content = 'Hello!') {
  const text = cleanText({ content, size: Math.round(Math.min(deck.width, deck.height) * 0.1) });
  const item = {
    id: uid('item'), type: 'object', name: nameFor(content), galleryId: null, text, svg: '',
    bx: 0, by: 0, bw: 1, bh: 1, x: deck.width / 2, y: deck.height / 2, sx: 1, sy: 1, rot: 0, opacity: 1,
    colorMap: {}, lineMap: {}, locked: false,
  };
  return rebuildText(item);
}

export const isText = (item) => !!item?.text;
