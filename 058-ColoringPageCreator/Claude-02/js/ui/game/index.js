/**
 * "Build this object" game shell: a full-screen layer over the editor with a mode menu,
 * an object picker and the play screens. Each screen is a function that fills the body.
 *
 *   openGame()  ->  menu  ->  [picker]  ->  play | create  ->  finish
 */
import { state, bus, setView } from '../../core/store.js';
import { h } from '../../core/util.js';
import { t } from '../../core/i18n.js';
import { gallery } from '../../services/gallery.js';
import { galleryThumb, monochrome } from '../../svg/render.js';
import { addColoringPage } from '../../editor/commands.js';
import { sound, stopSpeaking } from '../../game/audio.js';
import { toast } from '../dialog.js';
import { startPlay } from './play.js';
import { startCreate } from './create.js';
import { showFinish } from './finish.js';
import { voiceDialog } from './voiceDialog.js';
import { auditCustomDialog } from '../dialogs/auditCustom.js';

export const GAME_MODES = [
  { id: 'guided', icon: '🧸', age: '3–4' },
  { id: 'silhouette', icon: '🧩', age: '4–6' },
  { id: 'memory', icon: '🧠', age: '6+' },
  { id: 'create', icon: '🧱', age: '' },
];

const STARS = { easy: '⭐', medium: '⭐⭐', hard: '⭐⭐⭐' };
let root = null;

export function openGame() {
  if (root) return;
  const trail = []; // back stack of screen functions
  let controller = null;
  let finishView = null;

  const title = h('h2', { class: 'game-title' });
  const backBtn = h('button', { type: 'button', class: 'btn', onClick: () => back() }, `← ${t('game.back')}`);
  const soundBtn = h('button', { type: 'button', class: 'btn icon-toggle', onClick: toggleSound });
  const voiceBtn = h('button', { type: 'button', class: 'btn', onClick: () => voiceDialog(), title: t('game.voice'), 'aria-label': t('game.voice') }, '🗣️');
  const modeBtns = ['colored', 'uncolored'].map((m) =>
    h('button', { type: 'button', 'data-mode': m, onClick: () => setView({ mode: m }) }, t(`mode.${m}`)));
  const body = h('div', { class: 'game-body' });
  root = h('div', { class: 'game-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('game.title') },
    h('header', { class: 'game-header' },
      backBtn, title,
      h('span', { class: 'grow' }),
      h('div', { class: 'segmented', role: 'group', 'aria-label': t('mode.label') }, modeBtns),
      soundBtn,
      voiceBtn,
      h('button', { type: 'button', class: 'btn', onClick: close, 'aria-label': t('common.close') }, '✕'),
    ),
    body,
  );
  document.body.append(root);
  document.body.classList.add('game-open');

  const syncChrome = () => {
    modeBtns.forEach((b) => {
      const on = b.dataset.mode === state.deck.view.mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
    soundBtn.textContent = sound.on ? '🔊' : '🔇';
    soundBtn.title = soundBtn.ariaLabel = t('game.sound');
    backBtn.hidden = trail.length < 2;
  };
  function toggleSound() {
    sound.toggle();
    syncChrome();
  }
  const onView = () => {
    syncChrome();
    controller?.refresh?.();
    if (!trail.length) return;
    // Menu/picker thumbnails follow the mode too.
    if (trail.at(-1).rerenderOnMode) show(trail.at(-1), { push: false });
  };
  bus.on('view', onView);

  function teardown() {
    controller?.destroy?.();
    controller = null;
    finishView?.close();
    finishView = null;
    stopSpeaking();
  }

  function show(screen, { push = true } = {}) {
    teardown();
    if (push) trail.push(screen);
    screen();
    syncChrome();
  }
  function back() {
    if (trail.length < 2) return close();
    trail.pop();
    show(trail.at(-1), { push: false });
  }
  function close() {
    teardown();
    bus.off?.('view', onView);
    document.removeEventListener('keydown', onKey, true);
    document.body.classList.remove('game-open');
    root.remove();
    root = null;
  }
  function onKey(e) {
    // Escape first closes an open popover or dialog; only then does it go back.
    if (e.key === 'Escape' && !document.querySelector('dialog[open], .popover')) {
      e.preventDefault();
      back();
    }
  }
  document.addEventListener('keydown', onKey, true);

  /* ---------- screens ---------- */
  function menuScreen() {
    title.textContent = `🎮 ${t('game.title')}`;
    body.replaceChildren(
      h('div', { class: 'game-menu' },
        h('p', { class: 'game-lead' }, t('game.lead')),
        h('div', { class: 'mode-grid' },
          GAME_MODES.map((m) => {
            const card = h('button', { type: 'button', class: `mode-card mode-${m.id}`, onClick: () => (m.id === 'create' ? show(createScreen) : show(pickerScreen(m.id))) },
              h('span', { class: 'mode-icon', 'aria-hidden': 'true' }, m.icon),
              h('strong', {}, t(`game.mode.${m.id}`)),
              h('span', { class: 'mode-desc' }, t(`game.mode.${m.id}.desc`)),
              m.age ? h('span', { class: 'mode-age' }, t('game.age', { age: m.age })) : null);
            return card;
          }),
        ),
        h('p', { class: 'game-tools' },
          h('button', { type: 'button', class: 'btn btn-small', onClick: () => auditCustomDialog() }, `🔧 ${t('audit.menu')}`)),
      ),
    );
  }

  function pickerScreen(mode) {
    const screen = () => {
      title.textContent = `${GAME_MODES.find((m) => m.id === mode).icon} ${t(`game.mode.${mode}`)}`;
      const { mode: m, mono } = state.deck.view;
      const list = gallery.recipes().sort((a, b) => ['easy', 'medium', 'hard'].indexOf(a.difficulty) - ['easy', 'medium', 'hard'].indexOf(b.difficulty) || a.name.localeCompare(b.name));
      body.replaceChildren(
        h('div', { class: 'game-picker' },
          h('p', { class: 'game-lead' }, t('game.pick')),
          list.length
            ? h('div', { class: 'pick-grid' },
                list.map((item) =>
                  h('button', { type: 'button', class: 'pick-card', onClick: () => show(playScreen(mode, item)) },
                    h('div', { class: 'pick-art', html: galleryThumb(item, m, mono) }),
                    h('strong', {}, gallery.displayName(item)),
                    h('span', { class: 'pick-meta' }, `${STARS[item.difficulty] || ''} · ${t('game.parts', { n: item.partCount })}`)))
              )
            : h('p', { class: 'hint' }, t('game.noRecipes')),
        ),
      );
    };
    screen.rerenderOnMode = true;
    return screen;
  }

  function playScreen(mode, item) {
    return () => {
      title.textContent = `${GAME_MODES.find((x) => x.id === mode).icon} ${gallery.displayName(item)}`;
      controller = startPlay({ host: body, item, mode, onFinish: ({ revealed }) => finishPlay(mode, item, revealed) });
    };
  }

  function finishPlay(mode, item, revealed) {
    finishView = showFinish({
      host: body,
      name: gallery.displayName(item),
      svg: item.svg,
      bbox: item.bbox,
      recipe: item.recipe,
      fact: item.fact,
      revealed,
      actions: [
        { label: `🎨 ${t('game.colorIt')}`, primary: true, onClick: () => makePage(item, gallery.displayName(item)) },
        { label: `🔁 ${t('game.again')}`, onClick: () => show(playScreen(mode, item), { push: false }) },
        { label: `🎮 ${t('game.more')}`, onClick: () => back() },
      ],
    });
  }

  function createScreen() {
    title.textContent = `🧱 ${t('game.mode.create')}`;
    controller = startCreate({
      host: body,
      onDone: (made, { save, name }) => {
        finishView = showFinish({
          host: body,
          name,
          svg: made.svg,
          bbox: made.bbox,
          recipe: made.recipe,
          generic: true,
          actions: [
            { label: `🎨 ${t('game.colorIt')}`, primary: true, onClick: () => makePage(made, name) },
            { label: `⭐ ${t('game.saveToGallery')}`, onClick: save },
            { label: `🧱 ${t('game.keepBuilding')}`, onClick: () => finishView?.close() },
          ],
        });
      },
    });
  }

  /** The build becomes a coloring page on a slide, and the game closes. */
  function makePage(source, name) {
    addColoringPage({ svg: source.svg, bbox: source.bbox }, name);
    close();
    toast(t('game.pageAdded', { name }), 'success');
  }

  show(menuScreen);
}
