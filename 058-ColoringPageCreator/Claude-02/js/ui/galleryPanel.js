/** Left panel: searchable, categorised gallery. Click or drag an item to add it to the slide. */
import { bus, state } from '../core/store.js';
import { h } from '../core/util.js';
import { t } from '../core/i18n.js';
import { gallery } from '../services/gallery.js';
import { galleryThumb } from '../svg/render.js';
import { addFromGallery } from '../editor/commands.js';
import { promptText, confirmBox, toast } from './dialog.js';
import { showMenu } from './menu.js';
import { exportGalleryDialog, importGalleryFile } from './dialogs/galleryIO.js';
import { auditCustomDialog } from './dialogs/auditCustom.js';
import { VirtualGrid } from './virtualGrid.js';
import { theme } from '../core/theme.js';

export const galleryUi = { category: 'all', query: '', selectMode: false, selected: new Set() };

export function initGalleryPanel(root) {
  const search = h('input', { type: 'search', class: 'field search', placeholder: t('gallery.search'), 'aria-label': t('gallery.search') });
  const tabs = h('div', { class: 'tabs', role: 'tablist' });
  const grid = h('div', { class: 'gallery-grid' });
  const footer = h('div', { class: 'gallery-footer' });
  const title = h('div', { class: 'panel-title' });
  const loadingBar = h('div', { class: 'gallery-loading', role: 'status', hidden: true });
  root.replaceChildren(title, loadingBar, search, tabs, grid, footer);
  // Only the visible tiles exist in the DOM, however long the list is.
  const vgrid = new VirtualGrid(grid, { renderItem: (item) => card(item), minCol: 104, gap: 10, padX: 10, padTop: 4, padBottom: 10 });

  search.addEventListener('input', () => {
    galleryUi.query = search.value;
    renderGrid({ reset: true });
  });

  function renderTabs() {
    const all = [{ code: 'all', icon: '✨' }, ...gallery.categories()];
    tabs.replaceChildren(
      ...all.map((c) =>
        h('button', {
          type: 'button',
          role: 'tab',
          class: `tab ${galleryUi.category === c.code ? 'active' : ''}`,
          'aria-selected': galleryUi.category === c.code,
          onClick: () => {
            galleryUi.category = c.code;
            renderTabs();
            renderGrid({ reset: true });
          },
        }, h('span', { class: 'tab-icon', ...(c.logo ? { html: galleryThumb(c.logo, 'colored', '#000') } : {}) }, c.logo ? null : c.icon), h('span', {}, c.code === 'all' ? t('category.all') : gallery.categoryLabel(c.code))),
      ),
    );
  }

  function card(item) {
    const mode = state.deck?.view.mode || 'colored';
    const mono = state.deck?.view.mono || '#000000';
    const name = gallery.displayName(item);
    const picked = galleryUi.selected.has(item.id);
    const el = h('div', {
      class: `gcard ${picked ? 'picked' : ''}`,
      draggable: 'true',
      title: name,
      onClick: () => {
        if (galleryUi.selectMode) {
          picked ? galleryUi.selected.delete(item.id) : galleryUi.selected.add(item.id);
          renderGrid();
        } else addFromGallery(item.id);
      },
      onDragstart: (e) => {
        e.dataTransfer.setData('text/mcc-gallery', item.id);
        e.dataTransfer.effectAllowed = 'copy';
      },
    },
      h('div', { class: 'gthumb', html: galleryThumb(item, mode, mono) }),
      h('div', { class: 'gname' }, name),
      galleryUi.selectMode ? h('span', { class: 'gcheck' }, picked ? '✔' : '') : null,
      !galleryUi.selectMode
        ? h('div', { class: 'gactions' },
            h('button', { type: 'button', class: 'mini-btn', title: t('gallery.rename'), 'aria-label': t('gallery.rename'), onClick: (e) => { e.stopPropagation(); renameItem(item); } }, '✏️'),
            h('button', { type: 'button', class: 'mini-btn', title: t('gallery.delete'), 'aria-label': t('gallery.delete'), onClick: (e) => { e.stopPropagation(); deleteItem(item); } }, '🗑️'),
          )
        : null,
    );
    return el;
  }

  async function renameItem(item) {
    const name = await promptText({ title: t('gallery.rename'), label: t('gallery.nameLabel'), value: gallery.displayName(item) });
    if (name) gallery.rename(item.id, name);
  }

  async function deleteItem(item) {
    const ok = await confirmBox({ title: t('gallery.delete'), message: t('gallery.deleteConfirm', { name: gallery.displayName(item) }), okLabel: t('common.delete'), danger: true });
    if (ok) {
      galleryUi.selected.delete(item.id);
      gallery.remove(item.id);
    }
  }

  function renderGrid({ reset = false } = {}) {
    const items = gallery.search(galleryUi.query, galleryUi.category);
    const message = gallery.loading.active
      ? `⏳ ${t('gallery.loadingEmpty')}`
      : galleryUi.category === 'buildingBlocks' && !galleryUi.query ? t('gallery.emptyBlocks')
        : galleryUi.category === 'custom' && !galleryUi.query ? t('gallery.emptyCustom') : t('gallery.noResults');
    vgrid.setItems(items, { resetScroll: reset, empty: h('p', { class: 'empty' }, message) });
    renderFooter();
  }

  function renderFooter() {
    footer.replaceChildren(
      h('button', {
        type: 'button',
        class: `btn btn-small ${galleryUi.selectMode ? 'btn-primary' : ''}`,
        onClick: () => {
          galleryUi.selectMode = !galleryUi.selectMode;
          galleryUi.selected.clear();
          renderGrid();
        },
      }, galleryUi.selectMode ? t('gallery.selectDone', { n: galleryUi.selected.size }) : `☑ ${t('gallery.select')}`),
      h('button', {
        type: 'button',
        class: 'btn btn-small',
        onClick: (e) =>
          showMenu(e.currentTarget, [
            { icon: '📤', label: t('gallery.export'), onClick: () => exportGalleryDialog([...galleryUi.selected]) },
            { icon: '📥', label: t('gallery.import'), onClick: () => importGalleryFile().then((n) => n != null && toast(t('gallery.imported', { n }), 'success')) },
            { separator: true },
            { icon: '🔧', label: t('audit.menu'), onClick: () => auditCustomDialog() },
            { icon: '♻️', label: t('gallery.restore', { n: gallery.deletedCount }), disabled: !gallery.deletedCount, onClick: () => gallery.restoreDeleted() },
          ]),
      }, `⋯ ${t('gallery.more')}`),
    );
  }

  /** (Re)builds everything that contains translated text. */
  const refresh = () => {
    title.textContent = `🎨 ${t('gallery.title')}`;
    search.placeholder = t('gallery.search');
    search.setAttribute('aria-label', t('gallery.search'));
    renderTabs();
    renderGrid();
  };
  // Galleries arrive one by one: coalesce bursts of changes into one redraw per frame.
  let queued = false;
  const redraw = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      renderTabs();
      renderGrid();
    });
  };
  const showProgress = () => {
    const { active, done, total } = gallery.loading;
    loadingBar.hidden = !active;
    loadingBar.textContent = active ? `⏳ ${t('gallery.loading', { done, total })}` : '';
    loadingBar.style.setProperty('--p', `${total ? (done / total) * 100 : 0}%`);
  };
  gallery.on('change', redraw);
  gallery.on('progress', showProgress);
  bus.on('view', () => renderGrid());
  theme.on('change', () => vgrid.relayout());
  document.fonts?.ready.then(() => vgrid.relayout());
  bus.on('deckLoaded', () => renderGrid());
  refresh();
  showProgress();
  return { rebuild: refresh };
}
