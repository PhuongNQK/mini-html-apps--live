/**
 * Internationalisation.
 *
 * To add a language:
 *   1. copy i18n/en.json to i18n/<code>.json and translate the values
 *   2. add { "code": "<code>", "name": "<Native name>", "file": "i18n/<code>.json" }
 *      to the "languages" array in meta/config.json
 *
 * Static HTML uses  data-i18n / data-i18n-title / data-i18n-placeholder / data-i18n-aria
 * Dynamic code uses t('key', {param: value}).
 * Gallery item names may be translated with the key  gallery.item.<id>.
 */
import { Emitter } from './events.js';

const STORAGE_KEY = 'mcc.lang';
let languages = [];
let fallback = {};
let dict = {};
let current = 'en';

export const i18n = new Emitter();

async function loadFile(file) {
  const res = await fetch(file, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Cannot load ${file}`);
  return res.json();
}

export async function initI18n(config) {
  languages = config.languages;
  const base = languages.find((l) => l.code === 'en') || languages[0];
  try {
    fallback = await loadFile(base.file);
  } catch (err) {
    console.error(err);
  }
  let wanted = config.defaultLanguage;
  try {
    wanted = localStorage.getItem(STORAGE_KEY) || wanted;
  } catch { /* storage unavailable */ }
  if (!languages.some((l) => l.code === wanted)) wanted = base.code;
  await setLanguage(wanted, { silent: true });
}

export async function setLanguage(code, { silent = false } = {}) {
  const lang = languages.find((l) => l.code === code);
  if (!lang) return;
  try {
    dict = lang.code === (languages.find((l) => l.code === 'en') || languages[0]).code ? fallback : await loadFile(lang.file);
  } catch (err) {
    console.error(err);
    dict = fallback;
  }
  current = code;
  document.documentElement.lang = code;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch { /* ignore */ }
  applyStatic();
  if (!silent) i18n.emit('change', code);
}

export const getLanguages = () => languages;
export const getLanguage = () => current;
export const has = (key) => key in dict || key in fallback;

export function t(key, params) {
  let text = dict[key] ?? fallback[key] ?? key;
  if (params) for (const [k, v] of Object.entries(params)) text = text.replaceAll(`{${k}}`, v);
  return text;
}

/** Translates every element carrying a data-i18n* attribute. */
export function applyStatic(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
    if (!el.dataset.i18n && !el.textContent.trim()) el.setAttribute('aria-label', el.title);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => (el.placeholder = t(el.dataset.i18nPlaceholder)));
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  document.title = t('app.title');
}
