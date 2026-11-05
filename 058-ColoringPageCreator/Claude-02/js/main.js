/** Application bootstrap. */
import { loadConfig, config, findSlideSize } from './core/config.js';
import { initI18n, i18n, applyStatic } from './core/i18n.js';
import { loadDeck } from './core/store.js';
import { gallery } from './services/gallery.js';
import { workdir } from './services/workdir.js';
import { restoreLast, startAutosave } from './services/persistence.js';
import { createDeck } from './model/ops.js';
import { initCanvas } from './editor/canvas.js';
import { initShortcuts } from './editor/shortcuts.js';
import { initGalleryPanel } from './ui/galleryPanel.js';
import { initSlidesPanel } from './ui/slidesPanel.js';
import { initPropertiesPanel } from './ui/propertiesPanel.js';
import { initToolbar } from './ui/toolbar.js';
import { initWorkdirUi } from './ui/workdirUi.js';
import { toast } from './ui/dialog.js';
import { t } from './core/i18n.js';

async function boot() {
  await loadConfig();
  await initI18n(config);
  await gallery.init(config);
  await workdir.restore();

  if (!(await restoreLast())) {
    const size = findSlideSize(config.defaultSlideSize);
    loadDeck(createDeck({ name: t('project.defaultName'), width: size.width, height: size.height }));
  }

  const canvas = initCanvas(document.getElementById('workspace'));
  const galleryPanel = initGalleryPanel(document.getElementById('galleryPanel'));
  const slidesPanel = initSlidesPanel(document.getElementById('slideBar'));
  const propsPanel = initPropertiesPanel(document.getElementById('propsPanel'));

  const toolbar = initToolbar({ canvas });
  const dirUi = initWorkdirUi();
  initShortcuts();
  startAutosave(config.autosaveSeconds);

  // Re-render translated text when the language changes.
  i18n.on('change', () => {
    applyStatic();
    galleryPanel.rebuild();
    slidesPanel.rebuild();
    propsPanel.rebuild();
    toolbar.rebuild();
    dirUi.rebuild();
  });

  // A remembered working folder needs one click to re-grant access after a reload.
  if (workdir.pending) toast(t('workdir.pendingHint'));
  document.body.classList.remove('loading');
}

boot().catch((err) => {
  console.error(err);
  document.body.classList.remove('loading');
  document.getElementById('bootError').hidden = false;
  document.getElementById('bootError').textContent = `Magic Color could not start: ${err.message}. Serve this folder over HTTP (for example: python -m http.server).`;
});
