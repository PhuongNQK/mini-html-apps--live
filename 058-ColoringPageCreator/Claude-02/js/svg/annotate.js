/**
 * SVG preparation.
 *
 * Every gallery SVG goes through prepareSvg() once. It
 *   - sanitises the markup (no scripts / event handlers / external images),
 *   - writes explicit fill & stroke attributes on each shape (so objects can be recoloured),
 *   - adds a  data-u  attribute describing how the shape looks in "Uncolored" mode
 *     (@M is replaced with the Monochrome colour at render time),
 *   - measures the natural bounding box.
 *
 * Uncolored rules (designed for printable colouring pages):
 *   outline only           -> stroke in Monochrome colour
 *   filled + outlined      -> white fill, Monochrome outline
 *   small dark fill        -> solid Monochrome (eyes, pupils, nostrils ...)
 *   other filled shapes    -> white fill with a Monochrome outline
 */
import { SVG_NS, round } from '../core/util.js';

const SHAPES = ['path', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'line', 'text'];
const FORBIDDEN = new Set(['script', 'style', 'foreignobject', 'image', 'iframe', 'animate', 'set', 'animatetransform', 'animatemotion']);

let colorCtx = null;

export function normalizeColor(value) {
  if (value == null) return null;
  const c = String(value).trim().toLowerCase();
  if (!c) return null;
  if (c === 'none' || c === 'transparent') return 'none';
  if (/^#[0-9a-f]{6}$/.test(c)) return c;
  if (/^#[0-9a-f]{3}$/.test(c)) return '#' + [...c.slice(1)].map((x) => x + x).join('');
  if (c.startsWith('url(')) return c;
  if (c === 'currentcolor') return '#000000';
  colorCtx ||= document.createElement('canvas').getContext('2d');
  colorCtx.fillStyle = '#000000';
  colorCtx.fillStyle = c;
  const out = colorCtx.fillStyle;
  return /^#[0-9a-f]{6}$/i.test(out) ? out.toLowerCase() : '#000000';
}

export const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};

function declared(el, name) {
  const style = el.getAttribute('style');
  if (style) {
    for (const d of style.split(';')) {
      const i = d.indexOf(':');
      if (i > 0 && d.slice(0, i).trim() === name) return d.slice(i + 1).trim();
    }
  }
  return el.getAttribute(name);
}

function inherited(el, name, root) {
  for (let n = el; n && n.nodeType === 1; n = n.parentNode) {
    const v = declared(n, name);
    if (v != null && v !== 'inherit') return v;
    if (n === root) break;
  }
  return null;
}

const safeBBox = (el) => {
  try {
    return el.getBBox();
  } catch {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
};

/** Removes anything executable from a parsed SVG tree. */
export function sanitizeTree(root) {
  root.querySelectorAll('*').forEach((el) => {
    if (FORBIDDEN.has(el.localName.toLowerCase())) {
      el.remove();
      return;
    }
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase();
      const isLink = name === 'href' || name === 'xlink:href';
      if (name.startsWith('on') || (isLink && !attr.value.trim().startsWith('#'))) el.removeAttribute(attr.name);
    }
  });
}

function parse(markup) {
  const doc = new DOMParser().parseFromString(`<svg xmlns="${SVG_NS}">${markup}</svg>`, 'image/svg+xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid SVG markup');
  return document.importNode(doc.documentElement, true);
}

const innerMarkup = (root) =>
  [...root.childNodes]
    .map((n) => new XMLSerializer().serializeToString(n))
    .join('')
    .replace(/ xmlns="[^"]*"/g, '');

/** Sanitises markup without measuring (used when importing decks). */
export function sanitizeMarkup(markup) {
  const root = parse(markup);
  sanitizeTree(root);
  return innerMarkup(root);
}

/**
 * @param {string} markup  inner SVG markup (shapes, <g>, ...)
 * @param {{noPad?:boolean}} opts
 * @returns {{svg:string, bbox:{x:number,y:number,w:number,h:number}}}
 */
export function prepareSvg(markup, opts = {}) {
  const root = parse(markup);
  sanitizeTree(root);

  // Fold inline styles into attributes so a single mechanism handles colours.
  root.querySelectorAll('[style]').forEach((el) => {
    for (const d of el.getAttribute('style').split(';')) {
      const i = d.indexOf(':');
      if (i > 0) el.setAttribute(d.slice(0, i).trim(), d.slice(i + 1).trim());
    }
    el.removeAttribute('style');
  });

  const holder = document.createElement('div');
  holder.style.cssText = 'position:absolute;left:-99999px;top:0;visibility:hidden;pointer-events:none';
  holder.append(root);
  document.body.append(holder);

  try {
    const total = safeBBox(root);
    const totalArea = Math.max(total.width * total.height, 1);
    let maxStroke = 0;

    root.querySelectorAll(SHAPES.join(',')).forEach((el) => {
      const fill = normalizeColor(inherited(el, 'fill', root)) ?? '#000000';
      const stroke = normalizeColor(inherited(el, 'stroke', root)) ?? 'none';
      el.setAttribute('fill', fill);
      el.setAttribute('stroke', stroke);
      el.removeAttribute('data-u');

      const hasFill = fill !== 'none';
      const hasStroke = stroke !== 'none';
      if (hasStroke) maxStroke = Math.max(maxStroke, parseFloat(inherited(el, 'stroke-width', root)) || 1);

      let u = null;
      if (!hasFill && hasStroke) u = 'fill:none;stroke:@M;opacity:1';
      else if (hasFill && hasStroke) u = 'fill:#fff;stroke:@M;opacity:1';
      else if (hasFill) {
        const b = safeBBox(el);
        const small = b.width * b.height < totalArea * 0.06;
        const dark = fill.startsWith('#') && luminance(fill) < 0.35;
        u = dark && small ? 'fill:@M;stroke:none;opacity:1' : 'fill:#fff;stroke:@M;stroke-width:2;opacity:1';
      }
      if (u) el.setAttribute('data-u', u);
    });

    const b = safeBBox(root);
    const ok = b.width > 0 && b.height > 0;
    const pad = opts.noPad ? 0 : maxStroke / 2;
    const bbox = ok
      ? { x: round(b.x - pad), y: round(b.y - pad), w: round(b.width + pad * 2), h: round(b.height + pad * 2) }
      : { x: 0, y: 0, w: 100, h: 100 };
    return { svg: innerMarkup(root), bbox };
  } finally {
    holder.remove();
  }
}
