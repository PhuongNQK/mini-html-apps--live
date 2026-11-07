/**
 * Wires the static markup in index.html: top bar, edit bar, drawers (mobile) and splitter.
 * Buttons declare what they do with  data-action="name"  and what they need with
 * data-needs="sel | multi | group".
 */
import { bus, state, undo, redo, canUndo, canRedo, setView, setZoom } from '../core/store.js';
import { t, getLanguages, getLanguage, setLanguage } from '../core/i18n.js';
import { local } from '../services/storage.js';
import { saveNow } from '../services/persistence.js';
import { gallery } from '../services/gallery.js';
import * as cmd from '../editor/commands.js';
import { openColorPopover } from './colorPicker.js';
import { showMenu } from './menu.js';
import { promptText, toast } from './dialog.js';
import { newProjectDialog, openProjectsDialog, projectSettingsDialog, importDeckFile } from './dialogs/projects.js';
import { exportImagesDialog, printDialog } from './dialogs/exportPrint.js';
import { exportGalleryDialog, importGalleryFile } from './dialogs/galleryIO.js';
import { exportDeckFile } from '../services/exporter.js';
import { chooseWorkingDirectory } from './workdirUi.js';
import { appearanceDialog } from './dialogs/appearance.js';
import { openGame } from './game/index.js';

const $ = (id) => document.getElementById(id);

function toggleFullscreen() {
  if (!document.fullscreenEnabled) return toast(t('view.fullscreenUnsupported'), 'error');
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => toast(t('view.fullscreenUnsupported'), 'error'));
}

async function saveToGallery() {
  const items = cmd.selectedItems();
  if (!items.length) return;
  const name = await promptText({
    title: t('gallery.saveTitle'),
    label: t('gallery.nameLabel'),
    value: items.length === 1 ? items[0].name : t('gallery.customDefault'),
    okLabel: t('common.save'),
  });
  if (!name) return;
  cmd.saveSelectionToGallery(name);
  toast(t('gallery.saved', { name }), 'success');
}

export function initToolbar({ canvas }) {
  const actions = {
    projects: () => openProjectsDialog(),
    newProject: () => newProjectDialog(),
    save: async () => {
      const where = await saveNow();
      if (where) toast(t(where === 'dir' ? 'save.toDir' : 'save.toLocal'), 'success');
    },
    projectSettings: () => projectSettingsDialog(),
    undo,
    redo,
    print: () => printDialog(),
    fullscreen: toggleFullscreen,
    workdir: (el) => chooseWorkingDirectory(el),
    fit: () => canvas.fitToView(),
    zoomIn: () => setZoom(Math.min(4, state.zoom * 1.2), false),
    zoomOut: () => setZoom(Math.max(0.1, state.zoom / 1.2), false),
    duplicate: cmd.duplicateSelected,
    delete: cmd.removeSelected,
    group: cmd.groupSelected,
    ungroup: cmd.ungroupSelected,
    flipH: () => cmd.flipSelected('h'),
    flipV: () => cmd.flipSelected('v'),
    rotL: () => cmd.rotateSelected(-15),
    rotR: () => cmd.rotateSelected(15),
    front: () => cmd.layer('front'),
    forward: () => cmd.layer('forward'),
    backward: () => cmd.layer('backward'),
    back: () => cmd.layer('back'),
    saveToGallery,
    exportSlide: () => exportImagesDialog('slide'),
    exportDeck: () => exportImagesDialog('deck'),
    exportDeckFile: () => exportDeckFile(state.deck),
    importDeck: () => importDeckFile(),
    appearance: () => appearanceDialog(),
    game: () => openGame(),
    menu: (el) => showAppMenu(el),
  };

  function showAppMenu(anchor) {
    const langs = getLanguages();
    showMenu(anchor, [
      { icon: '➕', label: t('menu.newProject'), onClick: actions.newProject },
      { icon: '📂', label: t('menu.projects'), onClick: actions.projects },
      { icon: '⚙️', label: t('menu.projectSettings'), onClick: actions.projectSettings },
      { icon: '💾', label: t('menu.save'), onClick: actions.save },
      { separator: true },
      { icon: '🖼️', label: t('menu.exportSlide'), onClick: actions.exportSlide },
      { icon: '🗂️', label: t('menu.exportDeck'), onClick: actions.exportDeck },
      { icon: '📦', label: t('menu.exportDeckFile'), onClick: actions.exportDeckFile },
      { icon: '📥', label: t('menu.importDeck'), onClick: actions.importDeck },
      { icon: '🖨️', label: t('menu.print'), onClick: actions.print },
      { icon: '🎮', label: t('menu.game'), onClick: actions.game },
      { icon: '🖌️', label: t('menu.appearance'), onClick: actions.appearance },
      { separator: true },
      { icon: '📤', label: t('gallery.export'), onClick: () => exportGalleryDialog() },
      { icon: '📥', label: t('gallery.import'), onClick: () => importGalleryFile().then((n) => n != null && toast(t('gallery.imported', { n }), 'success')) },
      ...(langs.length > 1
        ? [{ separator: true }, ...langs.map((l) => ({ icon: '🌐', label: l.name, checked: l.code === getLanguage(), onClick: () => setLanguage(l.code) }))]
        : []),
    ]);
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (el && !el.disabled) actions[el.dataset.action]?.(el);
  });

  /* ----- mode + colours ----- */
  document.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => setView({ mode: b.dataset.mode })));
  $('btnMono').addEventListener('click', (e) => openColorPopover(e.currentTarget, state.deck.view.mono, { onInput: (c) => setView({ mono: c }), onCommit: () => {} }));
  $('btnBg').addEventListener('click', (e) => openColorPopover(e.currentTarget, state.deck.view.bg, { onInput: (c) => setView({ bg: c }), onCommit: () => {} }));

  /* ----- zoom ----- */
  const slider = $('zoomSlider');
  slider.addEventListener('input', () => setZoom(Number(slider.value) / 100, false));

  /* ----- state → UI ----- */
  const sync = () => {
    const deck = state.deck;
    if (!deck) return;
    document.querySelectorAll('[data-mode]').forEach((b) => {
      const on = b.dataset.mode === deck.view.mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
    $('monoSwatch').style.background = deck.view.mono;
    $('bgSwatch').style.background = deck.view.bg;
    $('projectName').textContent = deck.name;
    $('btnMono').classList.toggle('dim', deck.view.mode === 'colored');
    $('btnBg').classList.toggle('dim', deck.view.mode === 'uncolored');
  };
  const syncHistory = () => {
    document.querySelector('[data-action=undo]').disabled = !canUndo();
    document.querySelector('[data-action=redo]').disabled = !canRedo();
  };
  const syncSelection = () => {
    const items = cmd.selectedItems();
    document.querySelectorAll('[data-needs]').forEach((b) => {
      const need = b.dataset.needs;
      b.disabled = need === 'sel' ? !items.length : need === 'multi' ? items.length < 2 : !items.some((i) => i.type === 'group');
    });
  };
  const syncZoom = () => {
    slider.value = Math.round(state.zoom * 100);
    $('zoomLabel').textContent = `${Math.round(state.zoom * 100)}%`;
    $('btnFit').classList.toggle('active', state.fit);
  };
  bus.on('view', sync);
  bus.on('deck', sync);
  bus.on('deckLoaded', sync);
  bus.on('history', syncHistory);
  bus.on('selection', syncSelection);
  bus.on('deck', syncSelection);
  bus.on('zoom', syncZoom);
  document.addEventListener('fullscreenchange', () => {
    $('btnFullscreen').classList.toggle('active', !!document.fullscreenElement);
    $('fullscreenIcon').textContent = document.fullscreenElement ? '🗗' : '⛶';
  });
  if (!document.fullscreenEnabled) $('btnFullscreen').classList.add('dim');
  sync();
  syncHistory();
  syncSelection();
  syncZoom();

  /* ----- project name click = settings ----- */
  $('projectName').addEventListener('click', actions.projectSettings);

  initDrawers();
  initSplitter();
  gallery.on('change', () => {});
  return { rebuild: () => (sync(), syncZoom()) };
}

/** Mobile: gallery / properties become slide-in drawers. */
function initDrawers() {
  const backdrop = $('drawerBackdrop');
  const panels = { gallery: $('galleryPanel'), props: $('propsPanel') };
  const closeAll = () => {
    Object.values(panels).forEach((p) => p.classList.remove('open'));
    backdrop.classList.remove('show');
    document.querySelectorAll('[data-drawer]').forEach((b) => b.classList.remove('active'));
  };
  document.querySelectorAll('[data-drawer]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const panel = panels[btn.dataset.drawer];
      const willOpen = !panel.classList.contains('open');
      closeAll();
      if (willOpen) {
        panel.classList.add('open');
        backdrop.classList.add('show');
        btn.classList.add('active');
      }
    }),
  );
  backdrop.addEventListener('click', closeAll);
  // Adding something from the gallery closes the drawer so the result is visible.
  bus.on('deck', (e) => e?.label === 'add' && closeAll());
}

/** Resizable splitter between gallery and canvas. */
function initSplitter() {
  const splitter = $('splitter');
  const root = document.documentElement;
  const saved = Number(local.get('galleryWidth'));
  const apply = (w) => root.style.setProperty('--gallery-w', `${Math.min(560, Math.max(200, w))}px`);
  if (saved) apply(saved);

  splitter.addEventListener('pointerdown', (e) => {
    splitter.setPointerCapture(e.pointerId);
    splitter.classList.add('dragging');
    const left = $('galleryPanel').getBoundingClientRect().left;
    splitter.onpointermove = (ev) => apply(ev.clientX - left);
  });
  const stop = () => {
    splitter.onpointermove = null;
    splitter.classList.remove('dragging');
    local.set('galleryWidth', Math.round($('galleryPanel').getBoundingClientRect().width));
  };
  splitter.addEventListener('pointerup', stop);
  splitter.addEventListener('pointercancel', stop);
  splitter.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const w = $('galleryPanel').getBoundingClientRect().width + (e.key === 'ArrowRight' ? 20 : -20);
    apply(w);
    local.set('galleryWidth', Math.round(w));
  });
}
