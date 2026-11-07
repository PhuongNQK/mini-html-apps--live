/**
 * Create mode: a free sandbox. Drag any building block onto the board, then move, resize, turn, flip and
 * colour it. The build is a recipe, so it can be saved to the gallery (Custom) and played as a puzzle later.
 */
import { state } from '../../core/store.js';
import { h, clamp, clone, round, uid } from '../../core/util.js';
import { t } from '../../core/i18n.js';
import { gallery } from '../../services/gallery.js';
import { monochrome } from '../../svg/render.js';
import { prepareSvg } from '../../svg/annotate.js';
import { composeRecipe, partMarkup, trayThumb } from '../../game/recipe.js';
import { sound, speak } from '../../game/audio.js';
import { Board, beginDrag } from './board.js';
import { blockName, cap } from './names.js';
import { promptText, toast } from '../dialog.js';

const VIEW = { x: -6, y: -6, w: 112, h: 112 };
const COLORS = ['#ff6b6b', '#ff9f43', '#ffd23f', '#6bcb77', '#4ecdc4', '#4ea8de', '#a78bfa', '#ff8fb1', '#8a5a2b', '#ffffff', '#2b2b3b'];
const DEFAULT_SIZE = 0.38;

export function startCreate({ host, onDone }) {
  const getBlock = (id) => gallery.get(id);
  const board = new Board(VIEW);
  let parts = []; // recipe parts, each with a private _id
  let selected = null; // _id
  const undoStack = [];

  const paint = (markup) => {
    const { mode, mono } = state.deck.view;
    return mode === 'uncolored' ? monochrome(markup, mono) : markup;
  };
  const byId = (id) => parts.find((p) => p._id === id);

  const snapshot = () => {
    undoStack.push(clone(parts));
    if (undoStack.length > 60) undoStack.shift();
    syncTools();
  };
  const undo = () => {
    if (!undoStack.length) return;
    parts = undoStack.pop();
    if (!byId(selected)) selected = null;
    render();
  };

  /* ---------- DOM ---------- */
  const tools = h('div', { class: 'create-tools' });
  const tray = h('div', { class: 'game-tray', role: 'list', 'aria-label': t('game.tray') });
  const empty = h('div', { class: 'create-empty' }, `👆 ${t('game.createEmpty')}`);
  board.el.append(empty);
  host.replaceChildren(h('div', { class: 'game-play mode-create' }, h('div', { class: 'game-stage' }, board.el), tools, tray));

  function render() {
    const order = parts.map((p, i) => ({ p, i })).sort((a, b) => (a.p.z || 0) - (b.p.z || 0) || a.i - b.i);
    board.set('placed', order.map(({ p }) => `<g class="piece free" data-id="${p._id}">${paint(partMarkup(p, getBlock(p.block)))}</g>`).join(''));
    // Selection frame around the chosen piece.
    board.set('over', '');
    const g = selected && board.layers.placed.querySelector(`[data-id="${selected}"]`);
    if (g) {
      const b = g.getBBox();
      const pad = 1.5;
      board.set('over', `<rect class="sel-frame" x="${round(b.x - pad)}" y="${round(b.y - pad)}" width="${round(b.width + pad * 2)}" height="${round(b.height + pad * 2)}" rx="2"/>`);
    }
    empty.hidden = parts.length > 0;
    syncTools();
  }

  function renderTray() {
    const { mode, mono } = state.deck.view;
    tray.replaceChildren(
      ...gallery.blocks().map((b) => {
        const part = { block: b.id, x: 0, y: 0, sx: DEFAULT_SIZE, sy: DEFAULT_SIZE, rot: 0, flip: false, fill: null };
        const btn = h('button', { type: 'button', class: 'tray-piece', role: 'listitem', title: blockName(b.id), 'aria-label': blockName(b.id), html: trayThumb(part, b, mode, mono) });
        btn.addEventListener('pointerdown', (e) => {
          if (e.button > 0) return;
          e.preventDefault();
          sound.pick();
          beginDrag(e, board, (at) => paint(partMarkup(part, b, at)), {
            onMove: (what) => what === 'start' && btn.classList.add('lifted'),
            onDrop: (info) => {
              btn.classList.remove('lifted');
              // A tap drops the block in the middle (slightly offset so repeats don't hide each other).
              const at = info.moved ? (info.inside ? info : null) : { x: 50 + (parts.length % 5) * 4, y: 50 + (parts.length % 5) * 4 };
              if (at) add(b, at);
            },
          });
        });
        return btn;
      }),
    );
  }

  function add(block, at) {
    snapshot();
    const z = parts.reduce((m, p) => Math.max(m, p.z || 0), -1) + 1;
    const part = { _id: uid('pt'), block: block.id, x: round(clamp(at.x, 0, 100)), y: round(clamp(at.y, 0, 100)), sx: DEFAULT_SIZE, sy: DEFAULT_SIZE, rot: 0, flip: false, fill: null, label: cap(blockName(block.id)), z };
    parts.push(part);
    selected = part._id;
    sound.snap();
    board.sparkle(part.x, part.y);
    board.say(cap(blockName(block.id)), 1400);
    speak(blockName(block.id));
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
    const block = getBlock(part.block);
    const before = clone(parts);
    beginDrag(e, board, (at) => paint(partMarkup(part, block, at)), {
      origin: board.svg,
      grab: { x: part.x - start.x, y: part.y - start.y },
      onMove: (what) => what === 'start' && board.layers.placed.querySelector(`[data-id="${part._id}"]`)?.classList.add('lifted'),
      onDrop: (info) => {
        if (info.moved) {
          undoStack.push(before);
          if (info.inside) Object.assign(part, { x: round(clamp(info.x, -4, 104)), y: round(clamp(info.y, -4, 104)) });
          else parts = parts.filter((p) => p !== part), (selected = null); // dragged off the board = removed
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
  const scaleBy = (k) => edit((p) => ((p.sx *= k), (p.sy *= k), (p.sx = clamp(p.sx, -3, 3)), (p.sy = clamp(p.sy, 0.04, 3))));
  const tool = (icon, label, fn, { danger = false } = {}) =>
    h('button', { type: 'button', class: `btn mini-tool ${danger ? 'btn-danger' : ''}`, title: label, 'aria-label': label, onClick: fn }, icon);

  function syncTools() {
    const has = !!byId(selected);
    const swatches = COLORS.map((c) => {
      const b = h('button', { type: 'button', class: 'swatch-dot', title: c, 'aria-label': c, onClick: () => edit((p) => (p.fill = c)) });
      b.style.background = c;
      return b;
    });
    tools.replaceChildren(
      tool('↩️', t('toolbar.undo'), undo),
      h('span', { class: 'sep' }),
      ...(has
        ? [
            tool('➕', t('game.bigger'), () => scaleBy(1.15)),
            tool('➖', t('game.smaller'), () => scaleBy(1 / 1.15)),
            tool('↔️', t('game.wider'), () => edit((p) => (p.sx *= 1.15))),
            tool('↕️', t('game.taller'), () => edit((p) => (p.sy *= 1.15))),
            tool('⟲', t('edit.rotL'), () => edit((p) => (p.rot = (p.rot - 15) % 360))),
            tool('⟳', t('edit.rotR'), () => edit((p) => (p.rot = (p.rot + 15) % 360))),
            tool('🪞', t('edit.flipH'), () => edit((p) => (p.flip = !p.flip))),
            h('span', { class: 'sep' }),
            ...swatches,
            tool('🎨', t('props.resetColors'), () => edit((p) => (p.fill = null))),
            h('span', { class: 'sep' }),
            tool('⏫', t('edit.front'), () => edit((p) => (p.z = Math.max(...parts.map((q) => q.z || 0)) + 1))),
            tool('⏬', t('edit.back'), () => edit((p) => (p.z = Math.min(...parts.map((q) => q.z || 0)) - 1))),
            tool('📑', t('edit.duplicate'), () => {
              const p = byId(selected);
              snapshot();
              const copy = { ...clone(p), _id: uid('pt'), x: p.x + 5, y: p.y + 5, z: Math.max(...parts.map((q) => q.z || 0)) + 1 };
              parts.push(copy);
              selected = copy._id;
              render();
            }),
            tool('🗑️', t('edit.delete'), () => {
              snapshot();
              parts = parts.filter((p) => p._id !== selected);
              selected = null;
              render();
            }, { danger: true }),
          ]
        : [h('span', { class: 'tools-hint' }, parts.length ? t('game.selectHint') : '')]),
      h('span', { class: 'grow' }),
      tool('🧹', t('game.clear'), () => {
        if (!parts.length) return;
        snapshot();
        parts = [];
        selected = null;
        render();
      }),
      h('button', { type: 'button', class: 'btn', disabled: !parts.length, onClick: save }, `⭐ ${t('common.save')}`),
      h('button', { type: 'button', class: 'btn btn-primary', disabled: !parts.length, onClick: finish }, `🎉 ${t('game.imDone')}`),
    );
    const undoBtn = tools.querySelector('button');
    if (undoBtn) undoBtn.disabled = !undoStack.length;
  }

  /* ---------- finishing ---------- */
  const clean = () => parts.map(({ _id, ...p }) => p);

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
    const item = gallery.addCustom({ name, svg: made.svg, bbox: made.bbox, recipe: made.recipe });
    toast(t('gallery.saved', { name }), 'success');
    return item;
  }

  function finish() {
    const made = build();
    if (!made) return;
    sound.win();
    onDone(made, { save, keepBuilding: () => {}, name: t('game.myCreation') });
  }

  /* ---------- start ---------- */
  document.addEventListener('keydown', onKey);
  function onKey(e) {
    if (e.target.closest?.('input, textarea, dialog')) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && byId(selected)) {
      e.preventDefault();
      snapshot();
      parts = parts.filter((p) => p._id !== selected);
      selected = null;
      render();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undo();
    }
  }

  renderTray();
  render();

  return {
    refresh: () => (renderTray(), render()),
    destroy: () => document.removeEventListener('keydown', onKey),
  };
}
