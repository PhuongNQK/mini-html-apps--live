/** "Check my creations": repairs part counts of everything in the Custom category and says what changed. */
import { h } from '../../core/util.js';
import { t } from '../../core/i18n.js';
import { gallery } from '../../services/gallery.js';
import { modal } from '../dialog.js';

export function auditCustomDialog() {
  const { checked, fixed } = gallery.auditCustom();
  const list = fixed.length
    ? h('ul', { class: 'audit-list' },
        fixed.map((f) => h('li', {},
          h('strong', {}, f.name), ` – ${f.before ?? '?'} → ${f.after}`,
          f.note ? h('em', {}, ` (${f.note})`) : null)))
    : h('p', {}, `✅ ${t('audit.allGood')}`);
  return modal({
    title: `🔧 ${t('audit.title')}`,
    content: h('div', {}, h('p', {}, t('audit.summary', { checked, fixed: fixed.length })), list),
    actions: [{ label: t('common.ok'), primary: true }],
  });
}
