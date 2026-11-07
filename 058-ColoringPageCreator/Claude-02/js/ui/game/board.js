/**
 * The game board: one SVG in recipe coordinates (design grid 100x100) plus a sparkle layer,
 * and a pointer-drag helper shared by the tray and the board.
 */
import { SVG_NS, h } from '../../core/util.js';

const svgEl = (name, attrs = {}) => {
  const el = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
};

export class Board {
  /** @param {{x:number,y:number,w:number,h:number}} view  visible area in recipe units */
  constructor(view) {
    this.view = view;
    this.svg = svgEl('svg', { viewBox: `${view.x} ${view.y} ${view.w} ${view.h}`, class: 'game-svg', preserveAspectRatio: 'xMidYMid meet' });
    this.paper = svgEl('rect', { x: view.x, y: view.y, width: view.w, height: view.h, class: 'game-paper', rx: 3 });
    this.layers = {};
    this.svg.append(this.paper);
    for (const name of ['under', 'slots', 'placed', 'over', 'drag']) {
      this.layers[name] = svgEl('g', { class: `layer-${name}` });
      this.svg.append(this.layers[name]);
    }
    this.fx = h('div', { class: 'game-fx', 'aria-hidden': 'true' });
    this.bubble = h('div', { class: 'game-bubble', hidden: true, role: 'status' });
    this.el = h('div', { class: 'game-board' }, this.svg, this.fx, this.bubble);
  }

  /** Replaces one layer's markup. */
  set(layer, markup) {
    this.layers[layer].innerHTML = markup;
  }

  /** Client (screen) pixels -> recipe units. */
  toBoard(clientX, clientY) {
    const m = this.svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }

  /** Recipe units -> pixels relative to the board element. */
  toLocal(x, y) {
    const m = this.svg.getScreenCTM();
    const box = this.el.getBoundingClientRect();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(x, y).matrixTransform(m);
    return { x: p.x - box.left, y: p.y - box.top };
  }

  inside(clientX, clientY) {
    const r = this.svg.getBoundingClientRect();
    return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
  }

  /** A small burst of stars where a block landed. */
  sparkle(x, y) {
    const c = this.toLocal(x, y);
    for (let i = 0; i < 9; i++) {
      const a = (Math.PI * 2 * i) / 9 + Math.random() * 0.4;
      const d = 36 + Math.random() * 34;
      const s = h('span', { class: 'spark' }, ['✨', '⭐', '💫'][i % 3]);
      s.style.cssText = `left:${c.x}px;top:${c.y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`;
      this.fx.append(s);
      setTimeout(() => s.remove(), 900);
    }
  }

  /** Shows a short message on the board (block name, hints). */
  say(text, ms = 2200) {
    this.bubble.textContent = text;
    this.bubble.hidden = false;
    this.bubble.classList.remove('pop');
    void this.bubble.offsetWidth;
    this.bubble.classList.add('pop');
    clearTimeout(this._bubbleTimer);
    this._bubbleTimer = setTimeout(() => (this.bubble.hidden = true), ms);
  }

  destroy() {
    clearTimeout(this._bubbleTimer);
  }
}

/** Visible area around an object's bounding box (extra room for dragging in). */
export function viewAround(bbox, pad = 0.22) {
  const p = Math.max(bbox.w, bbox.h) * pad;
  return { x: bbox.x - p, y: bbox.y - p, w: bbox.w + p * 2, h: bbox.h + p * 2 };
}

/**
 * Drags a piece with the pointer. The piece lives in the board's drag layer so it can leave the board.
 *
 * @param {PointerEvent} e         the pointerdown event
 * @param {Board} board
 * @param {(at:{x:number,y:number})=>string} markup  piece markup drawn centred on `at`
 * @param {{x:number,y:number}} [grab]  offset between pointer and piece centre (for pieces already on the board)
 * @param {(info:{x:number,y:number,inside:boolean,moved:boolean})=>void} onDrop
 */
export function beginDrag(e, board, markup, { grab = { x: 0, y: 0 }, onDrop, onMove, threshold = 5, origin = e.currentTarget }) {
  const startX = e.clientX;
  const startY = e.clientY;
  let moved = false;
  let g = null;
  origin.setPointerCapture?.(e.pointerId);

  const at = (ev) => {
    const p = board.toBoard(ev.clientX, ev.clientY);
    return { x: p.x + grab.x, y: p.y + grab.y };
  };
  const move = (ev) => {
    if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) > threshold) {
      moved = true;
      g = svgEl('g', { class: 'dragging' });
      g.innerHTML = markup({ x: 0, y: 0 });
      board.layers.drag.append(g);
      onMove?.('start');
    }
    if (g) {
      const p = at(ev);
      g.setAttribute('transform', `translate(${p.x} ${p.y})`);
      onMove?.('move', p);
    }
  };
  const end = (ev, cancelled) => {
    origin.removeEventListener('pointermove', move);
    origin.removeEventListener('pointerup', up);
    origin.removeEventListener('pointercancel', cancel);
    origin.releasePointerCapture?.(e.pointerId);
    g?.remove();
    const p = at(ev);
    onDrop?.({ ...p, inside: !cancelled && board.inside(ev.clientX, ev.clientY), moved, cancelled });
  };
  const up = (ev) => end(ev, false);
  const cancel = (ev) => end(ev, true);
  origin.addEventListener('pointermove', move);
  origin.addEventListener('pointerup', up);
  origin.addEventListener('pointercancel', cancel);
}
