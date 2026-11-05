/**
 * Pure string renderers: the single place that knows how items become SVG.
 * Used by the canvas, thumbnails, exports and printing so all four always agree.
 */
import { round } from '../core/util.js';
import { transformAttr } from '../model/geometry.js';

/** Replaces the placeholders written by prepareSvg() with real Monochrome styles. */
export const monochrome = (svg, mono) =>
  svg.replace(/data-u="([^"]*)"/g, (_, style) => `style="${style.replaceAll('@M', mono)}"`);

/** Applies an item's colour overrides (original colour -> new colour). */
export function recolored(item) {
  const map = item.colorMap;
  if (!map || !Object.keys(map).length) return item.svg;
  return item.svg.replace(/fill="(#[0-9a-f]{6})"/g, (m, c) => (map[c] ? `fill="${map[c]}"` : m));
}

/**
 * @param {object} item  slide item
 * @param {{mode:'colored'|'uncolored', mono:string}} ctx
 * @param {boolean} top  tag with data-id (top-level items only, used for hit-testing)
 */
export function itemMarkup(item, ctx, top = false) {
  const uncolored = ctx.mode === 'uncolored';
  const opacity = !uncolored && item.opacity < 1 ? ` opacity="${round(item.opacity, 3)}"` : '';
  const id = top ? ` data-id="${item.id}"` : '';
  const inner =
    item.type === 'group'
      ? item.children.map((c) => itemMarkup(c, ctx)).join('')
      : uncolored
        ? monochrome(item.svg, ctx.mono)
        : recolored(item);
  return `<g${id}${opacity} transform="${transformAttr(item)}">${inner}</g>`;
}

export const backgroundColor = (deck, mode) => (mode === 'uncolored' ? '#ffffff' : deck.view.bg);

/** Background + all items (no <svg> wrapper). */
export function slideContent(slide, deck, ctx, { ids = false } = {}) {
  const bg = `<rect data-bg="1" x="0" y="0" width="${deck.width}" height="${deck.height}" fill="${backgroundColor(deck, ctx.mode)}"/>`;
  return bg + slide.items.map((i) => itemMarkup(i, ctx, ids)).join('');
}

/** A complete, standalone <svg> document string for a slide. */
export function slideSvg(slide, deck, { mode = deck.view.mode, responsive = false } = {}) {
  const ctx = { mode, mono: deck.view.mono };
  const size = responsive ? '' : ` width="${deck.width}" height="${deck.height}"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${deck.width} ${deck.height}"${size}>${slideContent(slide, deck, ctx)}</svg>`;
}

/** Thumbnail for a gallery item. */
export function galleryThumb(item, mode, mono) {
  const { x, y, w, h } = item.bbox;
  const pad = Math.max(w, h) * 0.04;
  const body = mode === 'uncolored' ? monochrome(item.svg, mono) : item.svg;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${round(x - pad)} ${round(y - pad)} ${round(w + pad * 2)} ${round(h + pad * 2)}" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
}
