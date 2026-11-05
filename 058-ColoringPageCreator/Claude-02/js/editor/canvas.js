/**
 * The editing canvas: renders the active slide, selection overlay and handles, and handles
 * pointer interaction (select, move, resize, rotate, marquee, drag & drop from gallery).
 * Rendering is delegated to svg/render.js so the canvas always matches exports and print.
 */
import { bus, state, activeSlide, select, beginLive, live, endLive, setZoom } from '../core/store.js';
import { SVG_NS, clamp, h, round } from '../core/util.js';
import { slideContent } from '../svg/render.js';
import { aabb, corners, deg, itemSize, rad, rectsIntersect, unionRects, normalizeAngle, transformAttr } from '../model/geometry.js';
import { addFromGallery } from './commands.js';

const HANDLES = { nw: [-1, -1], n: [0, -1], ne: [1, -1], e: [1, 0], se: [1, 1], s: [0, 1], sw: [-1, 1], w: [-1, 0] };
const MIN_SIZE = 6;
const PAD = 24;

export function initCanvas(workspace) {
  const sheet = h('div', { class: 'sheet' });
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.classList.add('stage-svg');
  const content = document.createElementNS(SVG_NS, 'g');
  const overlay = document.createElementNS(SVG_NS, 'g');
  svg.append(content, overlay);
  sheet.append(svg);
  workspace.append(sheet);

  let drag = null;
  let marquee = null;

  const itemById = (id) => activeSlide()?.items.find((i) => i.id === id);
  const coarse = () => matchMedia('(pointer: coarse)').matches;

  function toSlide(e) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: p.x, y: p.y };
  }

  /* ---------- rendering ---------- */

  function render() {
    const deck = state.deck;
    const slide = activeSlide();
    if (!deck || !slide) return;
    svg.setAttribute('viewBox', `0 0 ${deck.width} ${deck.height}`);
    content.innerHTML = slideContent(slide, deck, { mode: deck.view.mode, mono: deck.view.mono }, { ids: true });
    applyZoom();
    drawOverlay();
  }

  function applyZoom() {
    const deck = state.deck;
    if (!deck) return;
    const w = deck.width * state.zoom;
    const hgt = deck.height * state.zoom;
    svg.setAttribute('width', w);
    svg.setAttribute('height', hgt);
    sheet.style.width = `${w}px`;
    sheet.style.height = `${hgt}px`;
  }

  function fitToView() {
    const deck = state.deck;
    if (!deck) return;
    const aw = workspace.clientWidth - PAD * 2;
    const ah = workspace.clientHeight - PAD * 2;
    if (aw <= 0 || ah <= 0) return;
    setZoom(clamp(Math.min(aw / deck.width, ah / deck.height), 0.05, 3), true);
  }

  function drawOverlay() {
    const slide = activeSlide();
    if (!slide) return;
    const z = state.zoom;
    const sel = slide.items.filter((i) => state.selection.includes(i.id));
    let out = '';
    const poly = (pts, cls = 'sel-outline') => `<polygon class="${cls}" points="${pts.map((p) => `${round(p.x)},${round(p.y)}`).join(' ')}"/>`;

    for (const it of sel) out += poly(corners(it), it.locked ? 'sel-outline locked' : 'sel-outline');

    if (sel.length > 1) {
      const b = unionRects(sel.map(aabb));
      out += `<rect class="sel-box" x="${round(b.x)}" y="${round(b.y)}" width="${round(b.w)}" height="${round(b.h)}"/>`;
    } else if (sel.length === 1 && !sel[0].locked) {
      const it = sel[0];
      const { w, h: hh } = itemSize(it);
      const r = rad(it.rot);
      const ux = Math.cos(r), uy = Math.sin(r), vx = -Math.sin(r), vy = Math.cos(r);
      const size = (coarse() ? 18 : 11) / z;
      const at = (hx, hy, extra = 0) => ({
        x: it.x + hx * (w / 2) * ux + (hy * (hh / 2) + (hy === 0 ? 0 : Math.sign(hy) * extra)) * vx,
        y: it.y + hx * (w / 2) * uy + (hy * (hh / 2) + (hy === 0 ? 0 : Math.sign(hy) * extra)) * vy,
      });
      const top = at(0, -1);
      const rot = { x: it.x + (-hh / 2 - 30 / z) * vx, y: it.y + (-hh / 2 - 30 / z) * vy };
      out += `<line class="rot-line" x1="${round(top.x)}" y1="${round(top.y)}" x2="${round(rot.x)}" y2="${round(rot.y)}"/>`;
      out += `<circle class="handle rot" data-handle="rot" cx="${round(rot.x)}" cy="${round(rot.y)}" r="${round(size * 0.65)}"/>`;
      for (const [name, [hx, hy]] of Object.entries(HANDLES)) {
        const p = at(hx, hy);
        out += `<rect class="handle h-${name}" data-handle="${name}" x="${round(p.x - size / 2)}" y="${round(p.y - size / 2)}" width="${round(size)}" height="${round(size)}" rx="${round(size * 0.25)}" transform="rotate(${round(it.rot)} ${round(p.x)} ${round(p.y)})"/>`;
      }
    }
    if (marquee) {
      out += `<rect class="marquee" x="${round(marquee.x)}" y="${round(marquee.y)}" width="${round(marquee.w)}" height="${round(marquee.h)}"/>`;
    }
    overlay.innerHTML = out;
  }

  /** Cheap update during drags: only transforms + overlay. */
  function refreshLive() {
    const slide = activeSlide();
    for (const it of slide.items) content.querySelector(`[data-id="${it.id}"]`)?.setAttribute('transform', transformAttr(it));
    drawOverlay();
  }

  /* ---------- interaction ---------- */

  svg.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const p = toSlide(e);
    const handle = e.target.closest('[data-handle]');
    const itemEl = e.target.closest('[data-id]');
    const additive = e.shiftKey || e.ctrlKey || e.metaKey;

    if (handle) {
      startHandle(handle.dataset.handle, p);
    } else if (itemEl && !itemById(itemEl.dataset.id)?.locked) {
      const id = itemEl.dataset.id;
      if (additive) {
        select(state.selection.includes(id) ? state.selection.filter((s) => s !== id) : [...state.selection, id]);
        if (!state.selection.includes(id)) return;
      } else if (!state.selection.includes(id)) select([id]);
      const items = activeSlide().items.filter((i) => state.selection.includes(i.id) && !i.locked);
      drag = { type: 'move', start: p, moved: false, orig: new Map(items.map((i) => [i.id, { x: i.x, y: i.y }])) };
    } else {
      if (!additive) select([]);
      drag = { type: 'marquee', start: p, base: additive ? [...state.selection] : [] };
    }
    if (drag) svg.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  function startHandle(name, p) {
    const it = itemById(state.selection[0]);
    if (!it) return;
    if (name === 'rot') {
      drag = { type: 'rotate', id: it.id, cx: it.x, cy: it.y, a0: Math.atan2(p.y - it.y, p.x - it.x), rot0: it.rot, started: false };
      return;
    }
    const [hx, hy] = HANDLES[name];
    const { w, h: hh } = itemSize(it);
    const r = rad(it.rot);
    const u = { x: Math.cos(r), y: Math.sin(r) };
    const v = { x: -Math.sin(r), y: Math.cos(r) };
    const anchor = {
      x: it.x - hx * (w / 2) * u.x - hy * (hh / 2) * v.x,
      y: it.y - hx * (w / 2) * u.y - hy * (hh / 2) * v.y,
    };
    drag = { type: 'resize', id: it.id, hx, hy, u, v, anchor, w0: w, h0: hh, started: false };
  }

  svg.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const p = toSlide(e);

    if (drag.type === 'move') {
      const dx = p.x - drag.start.x;
      const dy = p.y - drag.start.y;
      if (!drag.moved) {
        if (Math.hypot(dx, dy) * state.zoom < 3) return;
        drag.moved = true;
        beginLive();
      }
      live((deck, slide) => {
        for (const it of slide.items) {
          const o = drag.orig.get(it.id);
          if (o) {
            it.x = o.x + dx;
            it.y = o.y + dy;
          }
        }
      });
    } else if (drag.type === 'resize') {
      if (!drag.started) {
        drag.started = true;
        beginLive();
      }
      live(() => {
        const it = itemById(drag.id);
        const d = { x: p.x - drag.anchor.x, y: p.y - drag.anchor.y };
        const lx = d.x * drag.u.x + d.y * drag.u.y;
        const ly = d.x * drag.v.x + d.y * drag.v.y;
        let nw = drag.hx ? Math.max(MIN_SIZE, lx * drag.hx) : drag.w0;
        let nh = drag.hy ? Math.max(MIN_SIZE, ly * drag.hy) : drag.h0;
        if (drag.hx && drag.hy && !e.shiftKey) {
          const k = Math.max(nw / drag.w0, nh / drag.h0);
          nw = drag.w0 * k;
          nh = drag.h0 * k;
        }
        it.sx = (Math.sign(it.sx) || 1) * (nw / it.bw);
        it.sy = (Math.sign(it.sy) || 1) * (nh / it.bh);
        it.x = drag.anchor.x + drag.hx * (nw / 2) * drag.u.x + drag.hy * (nh / 2) * drag.v.x;
        it.y = drag.anchor.y + drag.hx * (nw / 2) * drag.u.y + drag.hy * (nh / 2) * drag.v.y;
      });
    } else if (drag.type === 'rotate') {
      if (!drag.started) {
        drag.started = true;
        beginLive();
      }
      live(() => {
        const it = itemById(drag.id);
        let r = drag.rot0 + deg(Math.atan2(p.y - drag.cy, p.x - drag.cx) - drag.a0);
        if (e.shiftKey) r = Math.round(r / 15) * 15;
        it.rot = normalizeAngle(r);
      });
    } else if (drag.type === 'marquee') {
      marquee = { x: Math.min(p.x, drag.start.x), y: Math.min(p.y, drag.start.y), w: Math.abs(p.x - drag.start.x), h: Math.abs(p.y - drag.start.y) };
      const hits = activeSlide().items.filter((i) => !i.locked && rectsIntersect(aabb(i), marquee)).map((i) => i.id);
      select([...new Set([...drag.base, ...hits])]);
      drawOverlay();
    }
  });

  const finish = () => {
    if (!drag) return;
    endLive();
    drag = null;
    marquee = null;
    drawOverlay();
  };
  svg.addEventListener('pointerup', finish);
  svg.addEventListener('pointercancel', finish);

  /* ---------- drag & drop from the gallery ---------- */

  workspace.addEventListener('dragover', (e) => {
    if (e.dataTransfer.types.includes('text/mcc-gallery')) e.preventDefault();
  });
  workspace.addEventListener('drop', (e) => {
    const id = e.dataTransfer.getData('text/mcc-gallery');
    if (!id) return;
    e.preventDefault();
    addFromGallery(id, toSlide(e));
  });

  /* ---------- zoom ---------- */

  workspace.addEventListener(
    'wheel',
    (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setZoom(clamp(state.zoom * (e.deltaY < 0 ? 1.1 : 0.9), 0.1, 4), false);
    },
    { passive: false },
  );

  new ResizeObserver(() => state.fit && fitToView()).observe(workspace);

  /* ---------- wiring ---------- */

  const rerender = () => {
    if (state.fit) fitToView();
    render();
  };
  bus.on('deckLoaded', () => {
    state.fit = true;
  });
  bus.on('deck', rerender);
  bus.on('slide', rerender);
  bus.on('view', render);
  bus.on('selection', drawOverlay);
  // Gestures on the canvas only need transforms; property edits (colour, opacity) need a full redraw.
  bus.on('live', () => (drag ? refreshLive() : render()));
  bus.on('zoom', () => {
    applyZoom();
    drawOverlay();
  });

  if (state.deck) rerender();
  return { fitToView };
}
