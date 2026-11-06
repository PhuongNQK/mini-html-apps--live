/** Appearance dialog: choose a skin and a light / dark scheme, with live previews. */
import { config } from '../../core/config.js';
import { h } from '../../core/util.js';
import { has, t } from '../../core/i18n.js';
import { appearance, loadSkin, setScheme, setSkin, theme } from '../../core/theme.js';
import { modal } from '../dialog.js';

export const skinName = (skin) => (has(`skin.${skin.id}`) ? t(`skin.${skin.id}`) : skin.name || skin.id);
const skinDesc = (skin) => (has(`skin.${skin.id}.desc`) ? t(`skin.${skin.id}.desc`) : skin.description || '');

/** A miniature app drawn with the skin's own variables (scoped by data-skin). */
function preview(skin) {
  return h('div', { class: 'skin-preview', 'data-skin': skin.id, 'data-scheme': document.documentElement.dataset.scheme },
    h('div', { class: 'sp-bar' }, h('span', { class: 'sp-brand' }, skin.icon || '●')),
    h('div', { class: 'sp-body' },
      h('span', { class: 'sp-btn' }), h('span', { class: 'sp-btn gold' }),
      h('span', { class: 'sp-card' }),
    ),
  );
}

export async function appearanceDialog() {
  const schemeBtns = ['light', 'dark', 'auto'].map((s) =>
    h('button', {
      type: 'button',
      class: appearance.scheme === s ? 'active' : '',
      'aria-pressed': appearance.scheme === s,
      onClick: () => setScheme(s),
    }, `${{ light: '☀️', dark: '🌙', auto: '🖥️' }[s]} ${t(`scheme.${s}`)}`),
  );
  const schemeRow = h('div', { class: 'segmented scheme-picker', role: 'group', 'aria-label': t('appearance.scheme') }, schemeBtns);

  const grid = h('div', { class: 'skin-grid', role: 'radiogroup', 'aria-label': t('appearance.skin') });
  const renderGrid = () => {
    grid.replaceChildren(
      ...config.skins.map((skin) =>
        h('button', {
          type: 'button',
          role: 'radio',
          'aria-checked': appearance.skin === skin.id,
          class: `skin-card ${appearance.skin === skin.id ? 'active' : ''}`,
          onClick: () => setSkin(skin.id),
        }, preview(skin), h('strong', {}, `${skin.icon || ''} ${skinName(skin)}`), h('small', {}, skinDesc(skin))),
      ),
    );
  };
  // Previews need each skin's stylesheet.
  await Promise.all(config.skins.map((s) => loadSkin(s.id)));
  renderGrid();

  const off = theme.on('change', () => {
    schemeBtns.forEach((b, i) => {
      const on = ['light', 'dark', 'auto'][i] === appearance.scheme;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
    renderGrid();
  });

  await modal({
    title: t('appearance.title'),
    className: 'wide',
    content: h('div', { class: 'form' },
      h('div', { class: 'form-row' }, h('span', {}, t('appearance.scheme')), schemeRow),
      h('div', { class: 'form-row' }, h('span', {}, t('appearance.skin')), grid),
      h('p', { class: 'hint' }, t('appearance.hint')),
    ),
    actions: [{ label: t('common.close'), primary: true, value: true }],
  });
  off();
}
