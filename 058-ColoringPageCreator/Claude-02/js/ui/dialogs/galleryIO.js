/** Gallery export / import dialogs. */
import { downloadBlob, h, pickFiles, readText } from '../../core/util.js';
import { t } from '../../core/i18n.js';
import { gallery } from '../../services/gallery.js';
import { alertBox, modal, toast } from '../dialog.js';

export async function exportGalleryDialog(selectedIds = []) {
  const choices = [
    ['custom', t('galleryIO.scopeCustom', { n: gallery.customItems().length })],
    ['all', t('galleryIO.scopeAll', { n: gallery.all().length })],
    ['selected', t('galleryIO.scopeSelected', { n: selectedIds.length })],
  ];
  const initial = selectedIds.length ? 'selected' : gallery.customItems().length ? 'custom' : 'all';
  const radios = choices.map(([value, label]) =>
    h('label', { class: 'radio-row' },
      h('input', { type: 'radio', name: 'scope', value, checked: value === initial, disabled: value === 'selected' && !selectedIds.length }),
      h('span', {}, label)),
  );
  const form = h('div', { class: 'form' }, h('p', { class: 'hint' }, t('galleryIO.hint')), radios);
  const scope = await modal({
    title: t('gallery.export'),
    content: form,
    actions: [
      { label: t('common.cancel'), value: null },
      { label: t('common.export'), primary: true, onClick: (close) => close(form.querySelector('input:checked')?.value || null) },
    ],
  });
  if (!scope) return;
  downloadBlob(new Blob([gallery.exportText(scope, selectedIds)], { type: 'application/json' }), 'magic-color-gallery.json');
}

/** Lets the user choose a gallery file. Resolves with the number of items added (null = cancelled). */
export async function importGalleryFile() {
  const [file] = await pickFiles('.json,application/json');
  if (!file) return null;
  try {
    const added = gallery.importText(await readText(file));
    if (!added) {
      await alertBox({ title: t('gallery.import'), message: t('galleryIO.nothing') });
      return null;
    }
    return added;
  } catch {
    toast(t('galleryIO.invalid'), 'error');
    return null;
  }
}
