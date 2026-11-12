/**
 * Category tab strip shared by the Gallery panel and the game pickers.
 *   renderCategoryTabs(el, categories, current, onPick)
 * `categories` come from gallery.categories(); "All" is added in front. A category with a `logo`
 * shows one of its own shapes as the icon.
 */
import { h } from '../core/util.js';
import { t } from '../core/i18n.js';
import { gallery } from '../services/gallery.js';
import { galleryThumb } from '../svg/render.js';

export function renderCategoryTabs(el, categories, current, onPick) {
  const all = [{ code: 'all', icon: '✨' }, ...categories];
  el.replaceChildren(
    ...all.map((c) =>
      h('button', {
        type: 'button',
        role: 'tab',
        class: `tab ${current === c.code ? 'active' : ''}`,
        'aria-selected': current === c.code,
        onClick: () => onPick(c.code),
      }, h('span', { class: 'tab-icon', ...(c.logo ? { html: galleryThumb(c.logo, 'colored', '#000') } : {}) }, c.logo ? null : c.icon),
        h('span', {}, c.code === 'all' ? t('category.all') : gallery.categoryLabel(c.code)))),
  );
}
