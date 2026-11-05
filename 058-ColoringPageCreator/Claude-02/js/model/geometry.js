/**
 * Geometry helpers for slide items.
 *
 * Every item (object or group) is described by its natural box (bx,by,bw,bh), a centre
 * position on the slide (x,y), scale (sx,sy; negative = flipped) and rotation (degrees).
 * Rendered transform:  translate(x y) rotate(rot) scale(sx sy) translate(-cx -cy)
 */
import { round } from '../core/util.js';

export const rad = (deg) => (deg * Math.PI) / 180;
export const deg = (r) => (r * 180) / Math.PI;

export const itemSize = (item) => ({ w: item.bw * Math.abs(item.sx), h: item.bh * Math.abs(item.sy) });

export function transformAttr(item) {
  const cx = item.bx + item.bw / 2;
  const cy = item.by + item.bh / 2;
  return `translate(${round(item.x)} ${round(item.y)}) rotate(${round(item.rot)}) scale(${round(item.sx, 4)} ${round(item.sy, 4)}) translate(${round(-cx, 3)} ${round(-cy, 3)})`;
}

/** The four corners of the item in slide coordinates (clockwise from top-left). */
export function corners(item) {
  const { w, h } = itemSize(item);
  const r = rad(item.rot);
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [w / 2, h / 2],
    [-w / 2, h / 2],
  ].map(([px, py]) => ({ x: item.x + px * c - py * s, y: item.y + px * s + py * c }));
}

export function aabb(item) {
  const pts = corners(item);
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return { x: minX, y: minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY };
}

export function unionRects(rects) {
  const minX = Math.min(...rects.map((r) => r.x));
  const minY = Math.min(...rects.map((r) => r.y));
  const maxX = Math.max(...rects.map((r) => r.x + r.w));
  const maxY = Math.max(...rects.map((r) => r.y + r.h));
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

export const rectsIntersect = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export const normalizeAngle = (a) => {
  let r = ((a + 180) % 360 + 360) % 360 - 180;
  if (r === -180) r = 180;
  return r;
};
