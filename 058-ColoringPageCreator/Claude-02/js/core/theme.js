/**
 * Appearance = skin (visual style) × scheme (light / dark / auto).
 *
 * Skins are listed in meta/config.json ("skins"). A skin with a `file` is a stylesheet
 * loaded on demand that overrides CSS variables for  [data-skin="<id>"]  (see css/skins/).
 * The scheme only toggles  data-scheme  on <html>; css/scheme-dark.css does the rest.
 * To add a skin: copy any file in css/skins/, edit the variables, register it in config.
 */
import { Emitter } from './events.js';
import { config } from './config.js';
import { local } from '../services/storage.js';

const KEY = 'theme';
const SCHEMES = ['light', 'dark', 'auto'];
const loaded = new Map(); // skin id -> Promise

export const theme = new Emitter();
export const appearance = { skin: 'storybook', scheme: 'light' };

const media = window.matchMedia('(prefers-color-scheme: dark)');
const resolveScheme = () => (appearance.scheme === 'auto' ? (media.matches ? 'dark' : 'light') : appearance.scheme);

/** Loads a skin's stylesheet once. Never rejects (a missing file falls back to defaults). */
export function loadSkin(id) {
  const skin = config.skins.find((s) => s.id === id);
  if (!skin?.file) return Promise.resolve();
  if (!loaded.has(id)) {
    loaded.set(
      id,
      new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = skin.file;
        link.dataset.skinCss = id;
        link.onload = link.onerror = () => resolve();
        document.head.append(link);
        setTimeout(resolve, 2500); // don't block start-up if a web font @import is slow
      }),
    );
  }
  return loaded.get(id);
}

function apply() {
  const root = document.documentElement;
  root.dataset.skin = appearance.skin;
  root.dataset.scheme = resolveScheme();
  theme.emit('change', { ...appearance });
}

export async function setSkin(id) {
  if (!config.skins.some((s) => s.id === id)) return;
  await loadSkin(id);
  appearance.skin = id;
  local.set(KEY, { skin: appearance.skin, scheme: appearance.scheme });
  apply();
}

export function setScheme(scheme) {
  if (!SCHEMES.includes(scheme)) return;
  appearance.scheme = scheme;
  local.set(KEY, { skin: appearance.skin, scheme });
  apply();
}

export async function initTheme() {
  const saved = local.get(KEY, {}) || {};
  appearance.skin = config.skins.some((s) => s.id === saved.skin) ? saved.skin : config.skins.some((s) => s.id === config.defaultSkin) ? config.defaultSkin : config.skins[0].id;
  appearance.scheme = SCHEMES.includes(saved.scheme) ? saved.scheme : config.defaultScheme;
  await loadSkin(appearance.skin);
  apply();
  media.addEventListener('change', () => appearance.scheme === 'auto' && apply());
}
