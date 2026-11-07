/**
 * Play controller for the three puzzle modes built on a recipe:
 *   guided     – one glowing slot, the tray holds only the right block
 *   silhouette – every slot is shown, the tray mixes right and wrong blocks
 *   memory     – look at the finished object, then rebuild it without slots
 * The recipe fixes size, rotation and flip of every block; the child only drags.
 */
import { state } from '../../core/store.js';
import { h, clamp } from '../../core/util.js';
import { t } from '../../core/i18n.js';
import { gallery } from '../../services/gallery.js';
import { monochrome } from '../../svg/render.js';
import { partMarkup, slotMarkup, trayThumb, snapRadius, shuffled, blockCounts } from '../../game/recipe.js';
import { sound, speak } from '../../game/audio.js';
import { Board, viewAround, beginDrag } from './board.js';
import { blockName, cap, partLabel } from './names.js';

const DECOYS = { easy: 2, medium: 3, hard: 4 };

export function startPlay({ host, item, mode, onFinish }) {
  const recipe = item.recipe;
  const getBlock = (id) => gallery.get(id);
  const objSize = Math.max(item.bbox.w, item.bbox.h);
  const view = viewAround(item.bbox);
  const board = new Board(view);
  const total = recipe.length;

  const paint = (markup) => {
    const { mode: m, mono } = state.deck.view;
    return m === 'uncolored' ? monochrome(markup, mono) : markup;
  };
  const zOrder = [...recipe.keys()].sort((a, b) => (recipe[a].z || 0) - (recipe[b].z || 0) || a - b);

  /* ---------- state ---------- */
  const placed = new Map(); // part index -> {x,y}
  let pieces = [];          // tray / board pieces
  let current = 0;          // guided: index of the part being placed
  let phase = mode === 'memory' ? 'preview' : 'build';
  let fails = 0;
  let landed = -1;
  let finished = false;
  const timers = new Set();
  const later = (fn, ms) => {
    const id = setTimeout(() => (timers.delete(id), fn()), ms);
    timers.add(id);
  };

  const makePiece = (idx) => ({ key: `p${idx}`, idx, part: recipe[idx], state: 'tray', pos: null });
  const makeDecoys = () => {
    const used = new Set(recipe.map((p) => p.block));
    const pool = shuffled(gallery.blocks().filter((b) => !used.has(b.id)));
    return pool.slice(0, DECOYS[item.difficulty] ?? 3).map((b, i) => {
      const s = 0.3 + Math.random() * 0.2;
      return { key: `d${i}`, idx: -1, part: { block: b.id, x: 0, y: 0, sx: s, sy: s, rot: 0, flip: false, fill: null }, state: 'tray', pos: null };
    });
  };

  /* ---------- DOM ---------- */
  const prompt = h('div', { class: 'game-prompt', role: 'status' });
  const progress = h('div', { class: 'game-progress' }, h('span', { class: 'bar' }));
  const actions = h('div', { class: 'game-actions' });
  const tray = h('div', { class: 'game-tray', role: 'list', 'aria-label': t('game.tray') });
  const root = h('div', { class: `game-play mode-${mode}` },
    h('div', { class: 'game-stage' }, board.el),
    h('div', { class: 'game-status' }, prompt, progress, actions),
    tray,
  );
  host.replaceChildren(root);

  /* ---------- rendering ---------- */
  function slotsMarkup() {
    if (mode === 'memory') return '';
    return recipe
      .map((p, i) => {
        if (placed.has(i)) return '';
        const active = mode === 'guided' && i === current;
        return `<g class="slot ${active ? 'active' : mode === 'guided' ? 'faint' : ''}" data-i="${i}">${slotMarkup(p, getBlock(p.block))}</g>`;
      })
      .join('');
  }

  function placedMarkup() {
    let out = '';
    const draw = (idx, at, extra = '') => {
      const p = recipe[idx];
      out += `<g class="piece ${idx === landed ? 'landed' : ''} ${extra}" data-k="p${idx}">${paint(partMarkup(p, getBlock(p.block), at))}</g>`;
    };
    for (const idx of zOrder) {
      if (placed.has(idx)) draw(idx, placed.get(idx));
      else {
        const pc = pieces.find((x) => x.idx === idx && x.state === 'board');
        if (pc) draw(idx, pc.pos, 'free');
      }
    }
    // Decoys on the board (memory) are drawn last.
    for (const pc of pieces) {
      if (pc.idx === -1 && pc.state === 'board') out += `<g class="piece free" data-k="${pc.key}">${paint(partMarkup(pc.part, getBlock(pc.part.block), pc.pos))}</g>`;
    }
    return out;
  }

  function renderBoard() {
    board.set('slots', slotsMarkup());
    board.set('placed', placedMarkup());
    landed = -1;
  }

  function renderTray() {
    const { mode: m, mono } = state.deck.view;
    const visible = pieces.filter((p) => p.state === 'tray');
    tray.replaceChildren(
      ...visible.map((pc) => {
        const block = getBlock(pc.part.block);
        const btn = h('button', {
          type: 'button',
          class: 'tray-piece',
          role: 'listitem',
          'data-k': pc.key,
          'aria-label': blockName(block.id),
          title: blockName(block.id),
          html: trayThumb(pc.part, block, m, mono),
        });
        btn.addEventListener('pointerdown', (e) => pick(e, pc, btn));
        return btn;
      }),
    );
  }

  function renderStatus() {
    const done = placed.size;
    progress.hidden = mode === 'memory';
    progress.firstChild.style.width = `${(done / total) * 100}%`;
    progress.setAttribute('aria-label', `${done} / ${total}`);
    if (mode === 'guided') {
      const p = recipe[current];
      prompt.textContent = p ? t('game.guided', { block: blockName(p.block), label: partLabel(p.label) }) : '';
    } else if (mode === 'silhouette') prompt.textContent = t('game.silhouette', { done, total });
    else prompt.textContent = phase === 'preview' ? t('game.memLook') : t('game.memBuild');
    tray.hidden = phase === 'preview';
  }

  function renderActions() {
    const btns = [];
    if (mode === 'memory' && phase === 'preview') btns.push(h('button', { type: 'button', class: 'btn btn-primary', onClick: startBuild }, `👍 ${t('game.ready')}`));
    if (mode === 'memory' && phase === 'build') {
      btns.push(h('button', { type: 'button', class: 'btn', onClick: peek }, `👀 ${t('game.peek')}`));
      btns.push(h('button', { type: 'button', class: 'btn btn-primary', onClick: check }, `✅ ${t('game.check')}`));
      if (fails >= 2) btns.push(h('button', { type: 'button', class: 'btn', onClick: showMe }, `💡 ${t('game.showMe')}`));
    }
    actions.replaceChildren(...btns);
  }

  function renderAll() {
    renderBoard();
    renderTray();
    renderStatus();
    renderActions();
  }

  /* ---------- dragging ---------- */
  function pick(e, pc, btn) {
    if (finished || e.button > 0) return;
    e.preventDefault();
    const block = getBlock(pc.part.block);
    sound.pick();
    beginDrag(e, board, (at) => paint(partMarkup(pc.part, block, at)), {
      onMove: (what) => what === 'start' && btn.classList.add('lifted'),
      onDrop: (info) => {
        btn.classList.remove('lifted');
        if (!info.moved) return hint(pc);
        drop(pc, info, btn);
      },
    });
  }

  function hint() {
    if (mode === 'guided') {
      const p = recipe[current];
      board.say(t('game.dragHint', { block: blockName(p.block) }));
    } else board.say(t('game.dragAny'));
  }

  function drop(pc, info, btn) {
    if (mode === 'memory') {
      if (!info.inside) return; // back to the tray
      pc.state = 'board';
      pc.pos = clamp2(info);
      renderAll();
      return;
    }
    const gen = mode === 'guided' ? 1.8 : 1.25;
    const open = recipe.map((p, i) => i).filter((i) => !placed.has(i));
    const dist = (i) => Math.hypot(info.x - recipe[i].x, info.y - recipe[i].y);
    const fits = (i) => recipe[i].block === pc.part.block && dist(i) <= snapRadius(recipe[i], objSize, gen);
    const candidates = (mode === 'guided' ? [current] : open).filter(fits).sort((a, b) => dist(a) - dist(b));
    if (candidates.length) return land(candidates[0], pc);
    // Near a slot of a different block: a gentle "not there" instead of silence.
    const nearWrong = open.some((i) => dist(i) <= snapRadius(recipe[i], objSize, gen));
    if (info.inside && nearWrong) {
      sound.oops();
      board.say(mode === 'guided' ? t('game.notYet') : t('game.notThere'));
      btn?.classList.add('shake');
      later(() => btn?.classList.remove('shake'), 500);
    }
  }

  const clamp2 = (p) => ({ x: clamp(p.x, view.x + 4, view.x + view.w - 4), y: clamp(p.y, view.y + 4, view.y + view.h - 4) });

  /* ---------- landing a block ---------- */
  function land(idx, pc) {
    const part = recipe[idx];
    placed.set(idx, { x: part.x, y: part.y });
    pc.state = 'done';
    landed = idx;
    sound.snap();
    board.sparkle(part.x, part.y);
    narrate(idx);
    if (mode === 'guided') {
      current = recipe.findIndex((_, i) => !placed.has(i));
      pieces = current >= 0 ? [makePiece(current)] : [];
    }
    renderAll();
    if (placed.size === total) done(false);
  }

  function narrate(idx) {
    const part = recipe[idx];
    const sameTotal = recipe.filter((p) => p.block === part.block).length;
    const sameDone = [...placed.keys()].filter((i) => recipe[i].block === part.block).length;
    const label = partLabel(part.label);
    let text = cap(blockName(part.block)) + (label ? ` · ${label}` : '');
    if (sameTotal > 1) text += ` (${sameDone}/${sameTotal})`;
    board.say(text);
    let say = `${blockName(part.block)}. ${label}.`;
    if (sameTotal > 1 && sameDone === sameTotal) say += ` ${sameTotal} ${blockName(part.block, sameTotal)}!`;
    speak(say);
  }

  function done(revealed) {
    if (finished) return;
    finished = true;
    sound.win();
    later(() => onFinish({ revealed }), 900);
  }

  /* ---------- memory mode ---------- */
  function previewMarkup(opacity = 1) {
    return `<g opacity="${opacity}">${paint(item.svg)}</g>`;
  }

  function startPreview() {
    board.set('under', previewMarkup());
    const secs = clamp(4 + total * 0.6, 5, 10);
    progress.hidden = false;
    const bar = progress.firstChild;
    bar.style.transition = 'none';
    bar.style.width = '100%';
    void bar.offsetWidth;
    bar.style.transition = `width ${secs}s linear`;
    bar.style.width = '0%';
    later(startBuild, secs * 1000);
  }

  function startBuild() {
    if (phase !== 'preview') return;
    phase = 'build';
    board.set('under', '');
    pieces = shuffled([...recipe.keys()].map(makePiece).concat(makeDecoys()));
    progress.firstChild.style.transition = 'none';
    renderAll();
    progress.hidden = true;
  }

  function peek() {
    board.set('over', `<g class="peek">${previewMarkup(0.6)}</g>`);
    later(() => board.set('over', ''), 2200);
  }

  function check() {
    const onBoard = pieces.filter((p) => p.state === 'board' && p.idx !== -1);
    if (!onBoard.length) return board.say(t('game.placeSome'));
    const tol = objSize * 0.22;
    const used = new Set();
    let matched = 0;
    const order = [...recipe.keys()].sort((a, b) => Math.abs(recipe[b].sx * recipe[b].sy) - Math.abs(recipe[a].sx * recipe[a].sy));
    for (const i of order) {
      let best = null;
      for (const pc of pieces) {
        if (pc.state !== 'board' || used.has(pc.key) || pc.part.block !== recipe[i].block) continue;
        const d = Math.hypot(pc.pos.x - recipe[i].x, pc.pos.y - recipe[i].y);
        if (d <= tol && (!best || d < best.d)) best = { pc, d };
      }
      if (best) {
        used.add(best.pc.key);
        matched++;
      }
    }
    const extras = pieces.filter((p) => p.state === 'board' && !used.has(p.key)).length;
    if (matched / total >= 0.7 && extras <= Math.ceil(total * 0.3)) return reveal(false);
    fails++;
    sound.oops();
    board.say(t('game.matched', { n: matched, total }), 3200);
    renderActions();
  }

  function showMe() {
    reveal(true);
  }

  function reveal(revealed) {
    for (const [i, p] of recipe.entries()) placed.set(i, { x: p.x, y: p.y });
    pieces = [];
    landed = -1;
    renderAll();
    recipe.forEach((p) => board.sparkle(p.x, p.y));
    done(revealed);
  }

  // Free pieces on the board can be picked up again (memory mode).
  board.svg.addEventListener('pointerdown', (e) => {
    if (mode !== 'memory' || phase !== 'build' || finished) return;
    const g = e.target.closest?.('.piece.free');
    if (!g) return;
    const pc = pieces.find((p) => p.key === g.dataset.k);
    if (!pc) return;
    e.preventDefault();
    const start = board.toBoard(e.clientX, e.clientY);
    const block = getBlock(pc.part.block);
    g.classList.add('lifted');
    beginDrag(e, board, (at) => paint(partMarkup(pc.part, block, at)), {
      origin: board.svg,
      grab: { x: pc.pos.x - start.x, y: pc.pos.y - start.y },
      onDrop: (info) => {
        if (info.inside) pc.pos = clamp2(info);
        else pc.state = 'tray';
        renderAll();
      },
    });
  });

  /* ---------- start ---------- */
  if (mode === 'guided') pieces = [makePiece(0)];
  else if (mode === 'silhouette') pieces = shuffled([...recipe.keys()].map(makePiece).concat(makeDecoys()));
  renderAll();
  if (mode === 'memory') startPreview();
  else speak(t('game.intro', { name: gallery.displayName(item) }));

  return {
    refresh: () => renderAll(),
    destroy() {
      timers.forEach(clearTimeout);
      board.destroy();
    },
  };
}
