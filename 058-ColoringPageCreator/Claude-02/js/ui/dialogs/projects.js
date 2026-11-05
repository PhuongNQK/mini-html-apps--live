/** Project management: list / open / delete, create, edit settings, import. */
import { state, loadDeck, mutate } from '../../core/store.js';
import { config, findSlideSize } from '../../core/config.js';
import { h, pickFiles, readText } from '../../core/util.js';
import { t } from '../../core/i18n.js';
import { drafts } from '../../services/storage.js';
import { workdir } from '../../services/workdir.js';
import { createDeck } from '../../model/ops.js';
import { parseDeck } from '../../services/deckFile.js';
import { deleteDirFile, markUnsaved, openFromDir, openFromLocal, saveNow } from '../../services/persistence.js';
import { confirmBox, modal, toast } from '../dialog.js';

const fmtDate = (ms) => new Date(ms).toLocaleString();

/** Builds the "size" form block shared by the New and Edit dialogs. */
function sizeControls(initial) {
  const select = h('select', { class: 'field' },
    config.slideSizes.map((g) =>
      h('optgroup', { label: g.group }, g.sizes.map((s) => h('option', { value: s.id }, `${s.name} (${s.width}×${s.height})`))),
    ),
    h('option', { value: 'custom' }, t('size.custom')),
  );
  const w = h('input', { type: 'number', class: 'field num', min: 64, max: 8000, value: initial.width, 'aria-label': t('size.width') });
  const hh = h('input', { type: 'number', class: 'field num', min: 64, max: 8000, value: initial.height, 'aria-label': t('size.height') });
  const known = config.slideSizes.flatMap((g) => g.sizes).find((s) => s.width === initial.width && s.height === initial.height);
  select.value = known ? known.id : 'custom';

  select.addEventListener('change', () => {
    const preset = findSlideSize(select.value);
    if (select.value !== 'custom' && preset) {
      w.value = preset.width;
      hh.value = preset.height;
    }
  });
  const markCustom = () => {
    const match = config.slideSizes.flatMap((g) => g.sizes).find((s) => s.width === Number(w.value) && s.height === Number(hh.value));
    select.value = match ? match.id : 'custom';
  };
  w.addEventListener('input', markCustom);
  hh.addEventListener('input', markCustom);
  const swap = h('button', { type: 'button', class: 'btn btn-small', title: t('size.swap'), onClick: () => { [w.value, hh.value] = [hh.value, w.value]; markCustom(); } }, '⇄');

  return {
    el: h('div', { class: 'form-row' }, h('span', {}, t('size.label')), select,
      h('div', { class: 'size-row' }, w, h('span', {}, '×'), hh, swap)),
    read: () => ({ width: Math.round(Number(w.value)), height: Math.round(Number(hh.value)) }),
  };
}

const validSize = ({ width, height }) => width >= 64 && height >= 64 && width <= 8000 && height <= 8000;

async function leaveCurrent() {
  if (state.deck && state.dirty) await saveNow();
}

export async function newProjectDialog() {
  const def = findSlideSize(config.defaultSlideSize);
  const name = h('input', { type: 'text', class: 'field', value: t('project.defaultName'), maxlength: 60 });
  const size = sizeControls(def);
  const form = h('div', { class: 'form' }, h('label', { class: 'form-row' }, h('span', {}, t('project.name')), name), size.el);
  const result = await modal({
    title: t('project.new'),
    content: form,
    actions: [
      { label: t('common.cancel'), value: null },
      {
        label: t('project.create'),
        primary: true,
        onClick: (close) => {
          const dims = size.read();
          if (!validSize(dims)) return toast(t('size.invalid'), 'error');
          close({ name: name.value.trim() || t('project.defaultName'), ...dims });
        },
      },
    ],
  });
  if (!result) return false;
  await leaveCurrent();
  loadDeck(createDeck(result));
  markUnsaved();
  await saveNow();
  return true;
}

/** Rename / resize the open project. */
export async function projectSettingsDialog() {
  const deck = state.deck;
  const name = h('input', { type: 'text', class: 'field', value: deck.name, maxlength: 60 });
  const size = sizeControls(deck);
  const form = h('div', { class: 'form' }, h('label', { class: 'form-row' }, h('span', {}, t('project.name')), name), size.el, h('p', { class: 'hint' }, t('project.resizeHint')));
  const result = await modal({
    title: t('project.settings'),
    content: form,
    actions: [
      { label: t('common.cancel'), value: null },
      {
        label: t('common.save'),
        primary: true,
        onClick: (close) => {
          const dims = size.read();
          if (!validSize(dims)) return toast(t('size.invalid'), 'error');
          close({ name: name.value.trim() || deck.name, ...dims });
        },
      },
    ],
  });
  if (!result) return;
  mutate('project', (d) => {
    d.name = result.name;
    d.width = result.width;
    d.height = result.height;
  });
}

export async function openProjectsDialog() {
  if (state.dirty || !state.lastSaved) await saveNow();
  let dirRows = [];
  if (workdir.active) {
    try {
      dirRows = await workdir.listDecks();
    } catch (err) {
      console.warn(err);
    }
  }
  const list = h('div', { class: 'project-list' });

  const close = { fn: null };
  const row = (info, where) => {
    const current = state.deck?.id === info.id;
    return h('div', { class: `project-row ${current ? 'current' : ''}` },
      h('div', { class: 'project-info' },
        h('strong', {}, info.name, current ? ` · ${t('project.open')}` : ''),
        h('small', {}, `${info.width}×${info.height} · ${t('project.slides', { n: info.slides })} · ${fmtDate(info.modified)}`)),
      h('div', { class: 'project-actions' },
        h('button', {
          type: 'button',
          class: 'btn btn-small btn-primary',
          disabled: current,
          onClick: async () => {
            await leaveCurrent();
            try {
              if (where === 'dir') await openFromDir(info.file);
              else openFromLocal(info.id);
              close.fn(true);
            } catch {
              toast(t('project.openFailed'), 'error');
            }
          },
        }, t('project.openBtn')),
        h('button', {
          type: 'button',
          class: 'btn btn-small btn-danger',
          onClick: async () => {
            if (!(await confirmBox({ title: t('project.delete'), message: t('project.deleteConfirm', { name: info.name }), okLabel: t('common.delete'), danger: true }))) return;
            if (where === 'dir') await deleteDirFile(info.file);
            else drafts.remove(info.id);
            if (current) {
              const size = findSlideSize(config.defaultSlideSize);
              loadDeck(createDeck({ name: t('project.defaultName'), width: size.width, height: size.height }));
              markUnsaved();
            }
            dirRows = where === 'dir' ? dirRows.filter((r) => r.file !== info.file) : dirRows;
            renderList();
          },
        }, t('common.delete')),
      ),
    );
  };

  function renderList() {
    const local = drafts.list();
    list.replaceChildren(
      ...[
        workdir.active ? h('h3', {}, `📁 ${t('project.inFolder', { name: workdir.name })}`) : null,
        workdir.active ? (dirRows.length ? dirRows.map((r) => row(r, 'dir')) : h('p', { class: 'hint' }, t('project.noneInFolder'))) : null,
        h('h3', {}, `💾 ${t('project.inBrowser')}`),
        local.length ? local.map((r) => row(r, 'local')) : h('p', { class: 'hint' }, t('project.noneInBrowser')),
      ].flat().filter(Boolean),
    );
  }
  renderList();

  const body = h('div', { class: 'form' },
    h('div', { class: 'row-actions' },
      h('button', { type: 'button', class: 'btn btn-primary', onClick: async () => { if (await newProjectDialog()) close.fn(true); } }, `➕ ${t('project.new')}`),
      h('button', { type: 'button', class: 'btn', onClick: async () => { if (await importDeckFile()) close.fn(true); } }, `📥 ${t('project.import')}`),
    ),
    list,
  );
  const done = modal({ title: t('project.title'), content: body, actions: [{ label: t('common.close'), value: false }], className: 'wide' });
  // modal() owns the close function; expose it to row handlers via a tiny shim.
  close.fn = () => document.querySelector('dialog.wide')?.dispatchEvent(new Event('cancel'));
  return done;
}

/** Imports a deck file (.json) as a new project. */
export async function importDeckFile() {
  const [file] = await pickFiles('.json,application/json');
  if (!file) return false;
  try {
    const deck = parseDeck(await readText(file), { newId: true });
    await leaveCurrent();
    loadDeck(deck);
    markUnsaved();
    await saveNow();
    toast(t('project.imported', { name: deck.name }), 'success');
    return true;
  } catch {
    toast(t('project.importInvalid'), 'error');
    return false;
  }
}
