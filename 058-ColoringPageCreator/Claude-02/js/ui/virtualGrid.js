/**
 * Virtual grid: shows a very long list of tiles while keeping only the visible ones (plus a small
 * buffer) in the DOM. The scroller gets one tall, empty "sizer" element so the scrollbar reflects the whole
 * list; tiles are absolutely positioned inside it and created or removed as the user scrolls.
 *
 *   const grid = new VirtualGrid(scroller, { minCol: 104, gap: 10, renderItem: (item, index) => Node });
 *   grid.setItems(list);   // any time the list changes
 *
 * Tile height is measured from a real tile (so it follows skins and fonts) unless `cell` fixes the size.
 */
import { h } from '../core/util.js';

export class VirtualGrid {
  /**
   * @param {HTMLElement} scroller  element with a fixed height and overflow-y: auto
   * @param {{renderItem:(item:any,index:number)=>HTMLElement, minCol?:number, cell?:()=>number, gap?:number,
   *          padX?:number, padTop?:number, padBottom?:number, buffer?:number, center?:boolean}} options
   */
  constructor(scroller, options) {
    this.scroller = scroller;
    this.o = { minCol: 104, cell: null, gap: 10, padX: 10, padTop: 4, padBottom: 10, buffer: 2, center: false, ...options };
    this.items = [];
    this.nodes = new Map(); // index -> element
    this.metrics = null;
    this.sizer = h('div', { class: 'vg-sizer' });
    this.emptyEl = null;
    scroller.classList.add('vg');
    scroller.replaceChildren(this.sizer);

    this.queued = false;
    scroller.addEventListener('scroll', () => this.#schedule(), { passive: true });
    this.resizeObserver = new ResizeObserver(() => this.relayout());
    this.resizeObserver.observe(scroller);
  }

  /** Number of tiles currently in the DOM (handy for tests). */
  get rendered() {
    return this.nodes.size;
  }

  /** Replaces the list. `empty` (a node) is shown instead of tiles when the list is empty. */
  setItems(items, { resetScroll = false, empty = null } = {}) {
    this.items = items;
    this.emptyEl?.remove();
    this.emptyEl = items.length ? null : empty;
    if (this.emptyEl) this.scroller.append(this.emptyEl);
    if (resetScroll) this.scroller.scrollTop = 0;
    this.relayout();
  }

  /** Recomputes columns and tile size (after resize, skin or font changes) and redraws. */
  relayout() {
    this.#clear();
    const { items, o } = this;
    const width = this.scroller.clientWidth;
    if (!width || !items.length) {
      this.metrics = null;
      this.sizer.style.height = '0px';
      return;
    }
    const inner = width - o.padX * 2;
    const fixed = o.cell?.();
    const cols = Math.max(1, Math.floor((inner + o.gap) / ((fixed || o.minCol) + o.gap)));
    const cellW = fixed || (inner - (cols - 1) * o.gap) / cols;
    const cellH = fixed || this.#measure(items[0], cellW);
    const rowH = cellH + o.gap;
    const rows = Math.ceil(items.length / cols);
    const used = cols * cellW + (cols - 1) * o.gap;
    const left = o.padX + (o.center ? Math.max(0, (inner - used) / 2) : 0);
    this.metrics = { cols, cellW, cellH, rowH, rows, left };
    this.sizer.style.height = `${o.padTop + rows * rowH - o.gap + o.padBottom}px`;
    this.#update();
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.#clear();
  }

  /* ---------- internals ---------- */

  /** Height of a real tile at the given width (tiles never wrap, so all rows are alike). */
  #measure(item, width) {
    const probe = this.o.renderItem(item, 0);
    probe.style.cssText = `position:absolute;visibility:hidden;left:0;top:0;width:${width}px;box-sizing:border-box`;
    this.sizer.append(probe);
    const height = probe.offsetHeight || width;
    probe.remove();
    return height;
  }

  #clear() {
    for (const el of this.nodes.values()) el.remove();
    this.nodes.clear();
  }

  #schedule() {
    if (this.queued) return;
    this.queued = true;
    requestAnimationFrame(() => {
      this.queued = false;
      this.#update();
    });
  }

  #update() {
    const m = this.metrics;
    if (!m) return;
    const { o, items } = this;
    const top = this.scroller.scrollTop;
    const view = this.scroller.clientHeight;
    const firstRow = Math.max(0, Math.floor((top - o.padTop) / m.rowH) - o.buffer);
    const lastRow = Math.min(m.rows - 1, Math.floor((top + view - o.padTop) / m.rowH) + o.buffer);
    const from = firstRow * m.cols;
    const to = Math.min(items.length, (lastRow + 1) * m.cols);

    for (const [i, el] of this.nodes) {
      if (i < from || i >= to) {
        el.remove();
        this.nodes.delete(i);
      }
    }
    const fresh = [];
    for (let i = from; i < to; i++) {
      if (this.nodes.has(i)) continue;
      const el = this.o.renderItem(items[i], i);
      const row = Math.floor(i / m.cols);
      const col = i % m.cols;
      el.style.cssText += `;position:absolute;box-sizing:border-box;left:${m.left + col * (m.cellW + o.gap)}px;top:${o.padTop + row * m.rowH}px;width:${m.cellW}px;height:${m.cellH}px`;
      this.nodes.set(i, el);
      fresh.push(el);
    }
    if (fresh.length) this.sizer.append(...fresh);
  }
}
