/**
 * Create mode: a free sandbox.
 *  - Basic: the tray holds the building blocks.
 *  - Advanced: the tray is the whole gallery; any object can be dropped in and then taken apart
 *    (objects with a recipe fall back into their blocks, other drawings into their top-level shapes).
 * Pieces can be moved, resized, turned, flipped and recoloured. The build can be saved to the gallery
 * (Custom) and turned into a coloring page.
 */
import { state } from '../../core/store.js';
import { h, clamp, clone, round, uid, SVG_NS } from '../../core/util.js';
import { t } from '../../core/i18n.js';
import { gallery, svgParts } from '../../services/gallery.js';
import { local } from '../../services/storage.js';
import { monochrome, galleryThumb } from '../../svg/render.js';
import { prepareSvg } from '../../svg/annotate.js';
import { composeRecipe, partMarkup, trayThumb, mainColor } from '../../game/recipe.js';
import { sound, speak } from '../../game/audio.js';
import { Board, beginDrag } from './board.js';
import { blockName, cap } from './names.js';
import { promptText, toast } from '../dialog.js';
import { openColorPopover } from '../colorPicker.js';

const VIEW = { x: -6, y: -6, w: 112, h: 112 };
const COLORS = ['#ff6b6b', '#ff9f43', '#ffd23f', '#6bcb77', '#4ecdc4', '#4ea8de', '#a78bfa', '#ff8fb1', '#8a5a2b', '#ffffff', '#2b2b3b'];
const DEFAULT_SIZE = 0.38; // blocks: fraction of the 100-unit grid
const OBJECT_SIZE = 40;    // whole gallery objects: size on the board in grid units
const MAX_PIECES = 60;

/* ---------- small geometry helpers (2x2 matrices: columns (a,b) and (c,d)) ---------- */

const linear = (p) => {
  const a = ((p.rot || 0) * Math.PI) / 180;
  const f = p.flip ? -1 : 1;
  return { a: Math.cos(a) * f * p.sx, b: Math.sin(a) * f * p.sx, c: -Math.sin(a) * p.sy, d: Math.cos(a) * p.sy };
};
const mul = (m, n) => ({ a: m.a * n.a + m.c * n.b, b: m.b * n.a + m.d * n.b, c: m.a * n.c + m.c * n.d, d: m.b * n.c + m.d * n.d });
/** Inverse of linear(): back to scale, rotation (degrees) and flip. */
function decompose(m) {
  const sy = Math.hypot(m.c, m.d) || 1;
  const sin = -m.c / sy;
  const cos = m.d / sy;
  const sxSigned = m.a * cos + m.b * sin;
  return { sx: Math.abs(sxSigned), sy, rot: round((Math.atan2(sin, cos) * 180) / Math.PI, 2), flip: sxSigned < 0 };
}

/** Bounding box of svg markup (needs to be in the document to be measured). */
function measure(markup) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.style.cssText = 'position:absolute;left:-9999px;top:0;width:10px;height:10px';
  svg.innerHTML = markup;
  document.body.append(svg);
  let box = null;
  try {
    box = svg.getBBox();
  } catch {
    /* not drawable */
  }
  svg.remove();
  return box && (box.width || box.height) ? box : null;
}

/**
 * Splits a piece into smaller pieces, keeping its place, size, turn and flip.
 * @returns {object[]|null} the new parts, or null when there is nothing to split
 */
function takeApart(part, nextZ) {
  const parent = linear(part);
  const place = (x, y) => {
    const c = { x: part.cx ?? 0, y: part.cy ?? 0 };
    const dx = x - c.x;
    const dy = y - c.y;
    return { x: part.x + parent.a * dx + parent.c * dy, y: part.y + parent.b * dx + parent.d * dy };
  };
  const source = part.from && gallery.get(part.from);

  // Objects built from a recipe fall back into their building blocks.
  if (source?.recipe?.length && source.recipe.every((r) => gallery.get(r.block))) {
    return source.recipe.map((r, i) => {
      const pos = place(r.x, r.y);
      return { ...r, ...pos, ...decompose(mul(parent, linear(r))), z: nextZ + (r.z || 0) * 0.001 + i * 1e-6, label: r.label || cap(blockName(r.block)) };
    });
  }

  // Any other drawing falls apart into its top-level shapes.
  const kids = svgParts(part.svg);
  if (kids.length < 2 || kids.length > MAX_PIECES) return null;
  const ser = new XMLSerializer();
  const pieces = [];
  kids.forEach((el, i) => {
    const markup = ser.serializeToString(el);
    const box = measure(markup);
    if (!box) return;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    pieces.push({
      svg: markup, cx, cy, ...place(cx, cy),
      sx: part.sx, sy: part.sy, rot: part.rot, flip: part.flip, fill: null, line: null,
      label: `${part.label || ''} ${i + 1}`.trim(), z: nextZ + i * 1e-6,
    });
  });
  return pieces.length > 1 ? pieces : null;
}

export function startCreate({ host, onDone }) {
  const getBlock = (id) => gallery.get(id);
  const board = new Board(VIEW);
  let parts = []; // recipe parts, each with a private _id
  let selected = null; // _id
  let advanced = local.get('game.createMode', 'basic') === 'advanced';
  const adv = { category: 'all', query: '' };
  const undoStack = [];

  const paint = (markup) => {
    const { mode, mono } = state.deck.view;
    return mode === 'uncolored' ? monochrome(markup, mono) : markup;
  };
  const byId = (id) => parts.find((p) => p._id === id);
  const topZ = () => parts.reduce((m, p) => Math.max(m, p.z || 0), -1) + 1;
  const bottomZ = () => parts.reduce((m, p) => Math.min(m, p.z || 0), 0) - 1;

  const snapshot = () => {
    undoStack.push(clone(parts));
    if (undoStack.length > 60) undoStack.shift();
  };
  const undo = () => {
    if (!undoStack.length) return;
    parts = undoStack.pop();
    if (!byId(selected)) selected = null;
    render();
  };

  /* ---------- DOM ---------- */
  const tools = h('div', { class: 'create-tools' });
  const advBar = h('div', { class: 'adv-bar' });
  const tray = h('div', { class: 'game-tray', role: 'list', 'aria-label': t('game.tray') });
  const empty = h('div', { class: 'create-empty' }, `👆 ${t('game.createEmpty')}`);
  board.el.append(empty);
  host.replaceChildren(h('div', { class: 'game-play mode-create' }, h('div', { class: 'game-stage' }, board.el), tools, advBar, tray));

  /* ---------- rendering ---------- */
  function renderBoard() {
    const order = parts.map((p, i) => ({ p, i })).sort((a, b) => (a.p.z || 0) - (b.p.z || 0) || a.i - b.i);
    board.set('placed', order.map(({ p }) => `<g class="piece free" data-id="${p._id}">${paint(partMarkup(p, p.svg ? null : getBlock(p.block)))}</g>`).join(''));
    board.set('over', '');
    const g = selected && board.layers.placed.querySelector(`[data-id="${selected}"]`);
    if (g) {
      const b = g.getBBox();
      const pad = 1.5;
      board.set('over', `<rect class="sel-frame" x="${round(b.x - pad)}" y="${round(b.y - pad)}" width="${round(b.width + pad * 2)}" height="${round(b.height + pad * 2)}" rx="2"/>`);
    }
    empty.hidden = parts.length > 0;
  }
  function render() {
    renderBoard();
    syncTools();
  }

  /** What a tray entry creates when it is dropped on the board. */
  function newPart(item, at) {
    const base = { _id: uid('pt'), x: round(clamp(at.x, 0, 100)), y: round(clamp(at.y, 0, 100)), rot: 0, flip: false, fill: null, line: null, z: topZ() };
    if (item.category === 'buildingBlocks') return { ...base, block: item.id, sx: DEFAULT_SIZE, sy: DEFAULT_SIZE, label: cap(blockName(item.id)) };
    const { x, y, w, h: bh } = item.bbox;
    const k = (item.category === 'backgrounds' ? 100 : OBJECT_SIZE) / Math.max(w, bh);
    return { ...base, svg: item.svg, cx: x + w / 2, cy: y + bh / 2, from: item.id, sx: k, sy: k, label: gallery.displayName(item) };
  }
  const previewPart = (item) => {
    const p = newPart(item, { x: 0, y: 0 });
    return p;
  };

  function renderTray() {
    const { mode, mono } = state.deck.view;
    const items = advanced ? gallery.search(adv.query, adv.category) : gallery.blocks();
    tray.replaceChildren(
      ...items.map((item) => {
        const label = advanced ? gallery.displayName(item) : blockName(item.id);
        const thumb = advanced || item.category !== 'buildingBlocks'
          ? galleryThumb(item, mode, mono)
          : trayThumb({ block: item.id, x: 0, y: 0, sx: DEFAULT_SIZE, sy: DEFAULT_SIZE, rot: 0, flip: false, fill: null }, item, mode, mono);
        const btn = h('button', { type: 'button', class: 'tray-piece', role: 'listitem', title: label, 'aria-label': label, html: thumb });
        btn.addEventListener('pointerdown', (e) => {
          if (e.button > 0) return;
          e.preventDefault();
          sound.pick();
          const sample = previewPart(item);
          beginDrag(e, board, (at) => paint(partMarkup(sample, sample.svg ? null : item, at)), {
            onMove: (what) => what === 'start' && btn.classList.add('lifted'),
            onDrop: (info) => {
              btn.classList.remove('lifted');
              // A tap drops the piece in the middle (slightly offset so repeats don't hide each other).
              const at = info.moved ? (info.inside ? info : null) : { x: 50 + (parts.length % 5) * 4, y: 50 + (parts.length % 5) * 4 };
              if (at) add(item, at);
            },
          });
        });
        return btn;
      }),
    );
    if (!items.length) tray.replaceChildren(h('p', { class: 'hint pad' }, t('gallery.noResults')));
  }

  function renderAdvBar() {
    advBar.hidden = !advanced;
    if (!advanced) return advBar.replaceChildren();
    const select = h('select', { class: 'field', 'aria-label': t('game.category') },
      h('option', { value: 'all' }, t('category.all')),
      gallery.categories().map((c) => h('option', { value: c.code, selected: c.code === adv.category }, gallery.categoryLabel(c.code))));
    select.value = adv.category;
    select.addEventListener('change', () => {
      adv.category = select.value;
      renderTray();
    });
    const search = h('input', { type: 'search', class: 'field search', placeholder: t('gallery.search'), value: adv.query, 'aria-label': t('gallery.search') });
    search.addEventListener('input', () => {
      adv.query = search.value;
      renderTray();
    });
    advBar.replaceChildren(select, search, h('span', { class: 'hint' }, t('game.advancedHint')));
  }

  function add(item, at) {
    snapshot();
    const part = newPart(item, at);
    parts.push(part);
    selected = part._id;
    sound.snap();
    board.sparkle(part.x, part.y);
    board.say(part.label, 1400);
    speak(part.label);
    render();
  }

  /* ---------- moving pieces on the board ---------- */
  board.svg.addEventListener('pointerdown', (e) => {
    const g = e.target.closest?.('.piece');
    if (!g) {
      selected = null;
      return render();
    }
    const part = byId(g.dataset.id);
    if (!part) return;
    e.preventDefault();
    selected = part._id;
    render();
    const start = board.toBoard(e.clientX, e.clientY);
    const block = part.svg ? null : getBlock(part.block);
    const before = clone(parts);
    beginDrag(e, board, (at) => paint(partMarkup(part, block, at)), {
      origin: board.svg,
      grab: { x: part.x - start.x, y: part.y - start.y },
      onMove: (what) => what === 'start' && board.layers.placed.querySelector(`[data-id="${part._id}"]`)?.classList.add('lifted'),
      onDrop: (info) => {
        if (info.moved) {
          undoStack.push(before);
          if (info.inside) Object.assign(part, { x: round(clamp(info.x, -4, 104)), y: round(clamp(info.y, -4, 104)) });
          else (parts = parts.filter((p) => p !== part)), (selected = null); // dragged off the board = removed
        }
        render();
      },
    });
  });

  /* ---------- tools for the selected piece ---------- */
  const edit = (fn) => {
    const p = byId(selected);
    if (!p) return;
    snapshot();
    fn(p);
    render();
  };
  const scaleBy = (k) => edit((p) => ((p.sx = clamp(p.sx * k, 0.04, 6)), (p.sy = clamp(p.sy * k, 0.04, 6))));
  const tool = (icon, label, fn, { danger = false, text = true } = {}) =>
    h('button', { type: 'button', class: `btn mini-tool ${danger ? 'btn-danger' : ''}`, title: label, 'aria-label': label, onClick: fn },
      h('span', { 'aria-hidden': 'true' }, icon), text ? h('span', { class: 'tl' }, label) : null);

  /** Opens the full colour picker for `field` ('fill' | 'line'); the whole drag is one undo step. */
  function pickColor(anchor, field) {
    const p = byId(selected);
    if (!p) return;
    const start = p[field] || (field === 'fill' ? mainColor(p.svg || getBlock(p.block)?.svg || '') : '#2b2b3b') || '#ffffff';
    let began = false;
    openColorPopover(anchor, start, {
      onInput: (hex) => {
        if (!began) {
          snapshot();
          began = true;
        }
        p[field] = hex;
        renderBoard();
      },
      onCommit: () => (began = false),
    });
  }

  function syncTools() {
    const sel = byId(selected);
    const swatches = COLORS.map((c) => {
      const b = h('button', { type: 'button', class: 'swatch-dot', title: c, 'aria-label': c, onClick: () => edit((p) => (p.fill = c)) });
      b.style.background = c;
      return b;
    });
    const moreBtn = h('button', { type: 'button', class: 'btn mini-tool', title: t('game.moreColors'), 'aria-label': t('game.moreColors'), onClick: (e) => pickColor(e.currentTarget, 'fill') }, '…');
    const lineBtn = tool('🖊️', t('game.lineColor'), (e) => pickColor(e.currentTarget, 'line'));

    const modeSwitch = h('div', { class: 'segmented small', role: 'group', 'aria-label': t('game.createMode') },
      ['basic', 'advanced'].map((m) =>
        h('button', {
          type: 'button',
          class: (m === 'advanced') === advanced ? 'active' : '',
          'aria-pressed': (m === 'advanced') === advanced,
          title: t(`game.createMode.${m}.desc`),
          onClick: () => {
            advanced = m === 'advanced';
            local.set('game.createMode', m);
            renderAdvBar();
            renderTray();
            syncTools();
          },
        }, t(`game.createMode.${m}`))));

    tools.replaceChildren(
      modeSwitch,
      h('span', { class: 'sep' }),
      tool('↩️', t('toolbar.undo'), undo, { text: false }),
      h('span', { class: 'sep' }),
      ...(sel
        ? [
            tool('➕', t('game.bigger'), () => scaleBy(1.15)),
            tool('➖', t('game.smaller'), () => scaleBy(1 / 1.15)),
            tool('⇔', t('game.wider'), () => edit((p) => (p.sx = clamp(p.sx * 1.15, 0.04, 6)))),
            tool('⇕', t('game.taller'), () => edit((p) => (p.sy = clamp(p.sy * 1.15, 0.04, 6)))),
            tool('⟲', t('edit.rotL'), () => edit((p) => (p.rot = ((p.rot || 0) - 15) % 360))),
            tool('⟳', t('edit.rotR'), () => edit((p) => (p.rot = ((p.rot || 0) + 15) % 360))),
            tool('↔️', t('game.flipH'), () => edit((p) => (p.flip = !p.flip))),
            tool('↕️', t('game.flipV'), () => edit((p) => ((p.flip = !p.flip), (p.rot = ((p.rot || 0) + 180) % 360)))),
            ...(sel.svg ? [tool('🔨', t('game.takeApart'), apart)] : []),
            h('span', { class: 'sep' }),
            ...swatches,
            moreBtn,
            lineBtn,
            tool('🎨', t('props.resetColors'), () => edit((p) => ((p.fill = null), (p.line = null))), { text: false }),
            h('span', { class: 'sep' }),
            tool('⏫', t('edit.front'), () => edit((p) => (p.z = topZ()))),
            tool('⏬', t('edit.back'), () => edit((p) => (p.z = bottomZ()))),
            tool('📑', t('edit.duplicate'), () => {
              snapshot();
              const copy = { ...clone(sel), _id: uid('pt'), x: sel.x + 5, y: sel.y + 5, z: topZ() };
              parts.push(copy);
              selected = copy._id;
              render();
            }, { text: false }),
            tool('🗑️', t('edit.delete'), removeSelected, { danger: true, text: false }),
          ]
        : [h('span', { class: 'tools-hint' }, parts.length ? t('game.selectHint') : '')]),
      h('span', { class: 'grow' }),
      tool('🧹', t('game.clear'), () => {
        if (!parts.length) return;
        snapshot();
        parts = [];
        selected = null;
        render();
      }, { text: false }),
      h('button', { type: 'button', class: 'btn', disabled: !parts.length, onClick: save }, `⭐ ${t('common.save')}`),
      h('button', { type: 'button', class: 'btn btn-primary', disabled: !parts.length, onClick: finish }, `🎉 ${t('game.imDone')}`),
    );
    const undoBtn = tools.querySelector('.mini-tool');
    if (undoBtn) undoBtn.disabled = !undoStack.length;
  }

  function removeSelected() {
    if (!byId(selected)) return;
    snapshot();
    parts = parts.filter((p) => p._id !== selected);
    selected = null;
    render();
  }

  function apart() {
    const p = byId(selected);
    if (!p) return;
    const pieces = takeApart(p, p.z || 0);
    if (!pieces) return toast(t('game.cannotTakeApart'), 'error');
    snapshot();
    parts = parts.filter((q) => q !== p).concat(pieces.map((q) => ({ ...q, _id: uid('pt') })));
    selected = null;
    sound.snap();
    board.say(t('game.tookApart', { n: pieces.length }), 1800);
    render();
  }

  /* ---------- finishing ---------- */
  const clean = () => parts.map(({ _id, from, ...p }) => p);

  /** Composed, measured markup for what is on the board. */
  function build() {
    const recipe = clean();
    const svg = composeRecipe(recipe, getBlock);
    if (!svg) return null;
    return { svg, bbox: prepareSvg(svg).bbox, recipe };
  }

  async function save() {
    const made = build();
    if (!made) return;
    const name = await promptText({ title: t('gallery.saveTitle'), label: t('gallery.nameLabel'), value: t('gallery.customDefault'), okLabel: t('common.save') });
    if (!name) return null;
    const item = gallery.addCustom({ name, svg: made.svg, bbox: made.bbox, recipe: made.recipe, partCount: made.recipe.length });
    toast(t('gallery.saved', { name }), 'success');
    return item;
  }

  function finish() {
    const made = build();
    if (!made) return;
    sound.win();
    onDone(made, { save, name: t('game.myCreation') });
  }

  /* ---------- start ---------- */
  document.addEventListener('keydown', onKey);
  function onKey(e) {
    if (e.target.closest?.('input, textarea, select, dialog')) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && byId(selected)) {
      e.preventDefault();
      removeSelected();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undo();
    }
  }

  renderAdvBar();
  renderTray();
  render();

  return {
    refresh: () => (renderTray(), render()),
    destroy: () => document.removeEventListener('keydown', onKey),
  };
}
