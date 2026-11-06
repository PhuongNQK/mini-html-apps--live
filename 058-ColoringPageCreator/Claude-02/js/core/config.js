/** Application configuration, read from meta/config.json (with safe defaults). */
import { SLIDE_SIZES } from '../data/slideSizes.js';

export const config = {
  appName: 'Magic Color',
  defaultLanguage: 'en',
  languages: [{ code: 'en', name: 'English', file: 'i18n/en.json' }],
  /** Paths of additional gallery files to load (in addition to the built-in galleries). */
  galleries: [],
  autosaveSeconds: 120,
  defaultSlideSize: 'a4-landscape',
  slideSizes: SLIDE_SIZES,
  /**
   * Skins (visual styles). `file` is a stylesheet that overrides CSS variables for
   * [data-skin="<id>"]; the default skin lives in css/theme.css and needs no file.
   */
  skins: [
    { id: 'storybook', icon: '🏰' },
    { id: 'rounded', icon: '🫧', file: 'css/skins/rounded.css' },
    { id: 'sharp', icon: '⬛', file: 'css/skins/sharp.css' },
    { id: 'retro', icon: '🕹️', file: 'css/skins/retro.css' },
    { id: 'modern', icon: '✨', file: 'css/skins/modern.css' },
    { id: 'fairy', icon: '🧚', file: 'css/skins/fairy.css' },
  ],
  defaultSkin: 'storybook',
  defaultScheme: 'light', // 'light' | 'dark' | 'auto'
};

export async function loadConfig() {
  try {
    const res = await fetch('meta/config.json', { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.galleries)) config.galleries = data.galleries.filter((p) => typeof p === 'string');
      if (Array.isArray(data.languages) && data.languages.length) config.languages = data.languages;
      if (Array.isArray(data.slideSizes) && data.slideSizes.length) config.slideSizes = data.slideSizes;
      for (const key of ['appName', 'defaultLanguage', 'defaultSlideSize', 'defaultSkin']) {
        if (typeof data[key] === 'string') config[key] = data[key];
      }
      if (Array.isArray(data.skins)) {
        const ok = data.skins.filter((k) => /^[a-z0-9-]+$/.test(k?.id) && (!k.file || (typeof k.file === 'string' && !/^[a-z]+:|^\/\//i.test(k.file))));
        if (ok.length) config.skins = ok;
      }
      if (['light', 'dark', 'auto'].includes(data.defaultScheme)) config.defaultScheme = data.defaultScheme;
      if (Number(data.autosaveSeconds) > 0) config.autosaveSeconds = Number(data.autosaveSeconds);
    }
  } catch (err) {
    console.warn('meta/config.json could not be read; using defaults.', err);
  }
  return config;
}

export function findSlideSize(id) {
  for (const group of config.slideSizes) {
    const hit = group.sizes.find((s) => s.id === id);
    if (hit) return hit;
  }
  return config.slideSizes[0]?.sizes[0];
}
