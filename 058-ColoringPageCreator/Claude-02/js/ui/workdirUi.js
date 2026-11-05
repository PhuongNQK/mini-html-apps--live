/** Working Directory button / status + auto-save indicator in the top bar. */
import { bus, state } from '../core/store.js';
import { t } from '../core/i18n.js';
import { workdir } from '../services/workdir.js';
import { gallery } from '../services/gallery.js';
import { saveNow } from '../services/persistence.js';
import { toast, alertBox } from './dialog.js';
import { showMenu } from './menu.js';

export async function chooseWorkingDirectory(anchor) {
  if (!workdir.supported) {
    alertBox({ title: t('workdir.title'), message: t('workdir.unsupported') });
    return;
  }
  if (workdir.pending) {
    if (await workdir.reconnect()) afterConnect();
    else toast(t('workdir.denied'), 'error');
    return;
  }
  if (workdir.active) {
    showMenu(anchor, [
      { icon: '📁', label: t('workdir.change'), onClick: pick },
      { icon: '🔌', label: t('workdir.disconnect'), onClick: () => workdir.forget() },
    ]);
    return;
  }
  pick();
}

async function pick() {
  try {
    await workdir.choose();
    await afterConnect();
  } catch (err) {
    if (err?.name !== 'AbortError') toast(t('workdir.failed'), 'error');
  }
}

async function afterConnect() {
  const added = await gallery.loadFromWorkdir();
  await saveNow();
  await gallery.syncToWorkdir();
  toast(t('workdir.connected', { name: workdir.name }) + (added ? ` ${t('workdir.galleryMerged', { n: added })}` : ''), 'success');
}

export function initWorkdirUi() {
  const label = document.getElementById('workdirLabel');
  const status = document.getElementById('saveStatus');

  const renderDir = () => {
    label.textContent = workdir.active ? workdir.name : workdir.pending ? t('workdir.reconnect') : t('workdir.button');
  };
  const renderStatus = () => {
    const saved = state.lastSaved;
    status.classList.toggle('dirty', state.dirty);
    if (state.dirty) status.textContent = `● ${t('save.unsaved')}`;
    else if (saved) status.textContent = `✓ ${t(saved.where === 'dir' ? 'save.savedDir' : 'save.savedLocal', { time: new Date(saved.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })}`;
    else status.textContent = '';
  };
  workdir.on('change', renderDir);
  bus.on('dirty', renderStatus);
  bus.on('saved', renderStatus);
  bus.on('saveError', () => toast(t('save.failed'), 'error'));
  renderDir();
  renderStatus();
  return { rebuild: () => (renderDir(), renderStatus()) };
}
