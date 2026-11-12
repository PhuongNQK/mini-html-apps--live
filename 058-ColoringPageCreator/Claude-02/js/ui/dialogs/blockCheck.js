/** "Check building blocks": lists shapes whose building blocks are incomplete, grouped by problem and category. */
import { h } from '../../core/util.js';
import { t } from '../../core/i18n.js';
import { gallery } from '../../services/gallery.js';
import { modal } from '../dialog.js';

const KINDS = ['missing', 'count', 'noRecipe'];

export function blockCheckDialog() {
  const { checked, issues } = gallery.blockCheck();
  const sections = KINDS.map((kind) => {
    const list = issues.filter((i) => i.kind === kind);
    if (!list.length) return null;
    const byCategory = new Map();
    for (const i of list) byCategory.set(i.category, [...(byCategory.get(i.category) || []), i]);
    return h('section', { class: 'check-section' },
      h('h3', {}, `${t(`blockcheck.kind.${kind}`)} (${list.length})`),
      h('p', { class: 'hint' }, t(`blockcheck.hint.${kind}`)),
      [...byCategory].map(([category, items]) =>
        h('details', {},
          h('summary', {}, `${gallery.categoryLabel(category)} (${items.length})`),
          h('ul', { class: 'audit-list' },
            items.map((i) => h('li', {}, h('strong', {}, i.name), i.missing?.length ? h('em', {}, ` – ${t('blockcheck.missing', { blocks: i.missing.join(', ') })}`) : null))))));
  });
  const ok = !issues.length;
  return modal({
    title: `🧱 ${t('blockcheck.title')}`,
    content: h('div', { class: 'check-body' },
      h('p', {}, t('blockcheck.summary', { checked, bad: issues.length })),
      ok ? h('p', {}, `✅ ${t('blockcheck.allGood')}`) : sections),
    actions: [{ label: t('common.ok'), primary: true }],
  });
}
