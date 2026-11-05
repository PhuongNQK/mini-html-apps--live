/**
 * Dual colour palette:
 *   1. a pre-defined palette of standard colours (fast, consistent choices)
 *   2. a continuous spectrum picker (saturation/brightness square + hue slider + hex field)
 *
 * onInput(hex)  fires continuously while dragging; onCommit(hex) when the choice is final.
 */
import { clamp, h } from '../core/util.js';
import { t } from '../core/i18n.js';
import { showPopover } from './menu.js';

export const STANDARD_COLORS = [
  '#000000', '#4a4a4a', '#9e9e9e', '#d9d9d9', '#ffffff', '#7b4a2a',
  '#e53935', '#ff6b6b', '#ff8fb8', '#ff9f43', '#ffd23f', '#fff3b0',
  '#43b05c', '#8ee89b', '#1b8a5a', '#4d96ff', '#9fd0ff', '#1d4ed8',
  '#845ec2', '#c9a7ff', '#ffd9b8', '#f2a03d', '#2b2b3b', '#00b8a9',
];

/* ----- colour maths ----- */
const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let hue = 0;
  if (d) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  return [hue, max ? d / max : 0, max];
}

function hsvToRgb(hue, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = v - c;
  const [r, g, b] = hue < 60 ? [c, x, 0] : hue < 120 ? [x, c, 0] : hue < 180 ? [0, c, x] : hue < 240 ? [0, x, c] : hue < 300 ? [x, 0, c] : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

/**
 * @returns {{el:HTMLElement, setValue:(hex:string)=>void}}
 */
export function createColorPicker({ value = '#000000', onInput = () => {}, onCommit = () => {} } = {}) {
  let [hue, sat, val] = rgbToHsv(...hexToRgb(value));
  let current = value;

  const swatches = h('div', { class: 'cp-swatches', role: 'listbox', 'aria-label': t('color.standard') },
    STANDARD_COLORS.map((c) =>
      h('button', {
        type: 'button',
        class: 'cp-swatch',
        style: `background:${c}`,
        title: c,
        'aria-label': c,
        onClick: () => {
          setValue(c);
          onInput(c);
          onCommit(c);
        },
      }),
    ),
  );

  const sv = h('canvas', { class: 'cp-sv', width: 220, height: 130, 'aria-label': t('color.spectrum') });
  const hueInput = h('input', { type: 'range', class: 'cp-hue', min: 0, max: 360, step: 1, value: Math.round(hue), 'aria-label': t('color.hue') });
  const hex = h('input', { type: 'text', class: 'field cp-hex', maxlength: 7, value: current, 'aria-label': t('color.hex') });
  const preview = h('span', { class: 'cp-preview', style: `background:${current}` });

  function drawSV() {
    const ctx = sv.getContext('2d');
    const { width, height } = sv;
    const base = ctx.createLinearGradient(0, 0, width, 0);
    base.addColorStop(0, '#fff');
    base.addColorStop(1, rgbToHex(...hsvToRgb(hue, 1, 1)));
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);
    const shade = ctx.createLinearGradient(0, 0, 0, height);
    shade.addColorStop(0, 'rgba(0,0,0,0)');
    shade.addColorStop(1, '#000');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, width, height);
    const x = sat * width;
    const y = (1 - val) * height;
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, 8.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  function paint() {
    current = rgbToHex(...hsvToRgb(hue, sat, val));
    hex.value = current;
    preview.style.background = current;
    hueInput.value = Math.round(hue);
    drawSV();
  }

  function setValue(next) {
    if (!/^#[0-9a-f]{6}$/i.test(next)) return;
    [hue, sat, val] = rgbToHsv(...hexToRgb(next));
    paint();
    current = next.toLowerCase();
    hex.value = current;
    preview.style.background = current;
  }

  const pick = (e) => {
    const r = sv.getBoundingClientRect();
    sat = clamp((e.clientX - r.left) / r.width, 0, 1);
    val = 1 - clamp((e.clientY - r.top) / r.height, 0, 1);
    paint();
    onInput(current);
  };
  sv.addEventListener('pointerdown', (e) => {
    sv.setPointerCapture(e.pointerId);
    pick(e);
    sv.onpointermove = pick;
  });
  const end = () => {
    if (sv.onpointermove) {
      sv.onpointermove = null;
      onCommit(current);
    }
  };
  sv.addEventListener('pointerup', end);
  sv.addEventListener('pointercancel', end);

  hueInput.addEventListener('input', () => {
    hue = Number(hueInput.value);
    paint();
    onInput(current);
  });
  hueInput.addEventListener('change', () => onCommit(current));

  hex.addEventListener('change', () => {
    let v = hex.value.trim();
    if (!v.startsWith('#')) v = `#${v}`;
    if (/^#[0-9a-f]{3}$/i.test(v)) v = '#' + [...v.slice(1)].map((c) => c + c).join('');
    if (/^#[0-9a-f]{6}$/i.test(v)) {
      setValue(v);
      onInput(current);
      onCommit(current);
    } else hex.value = current;
  });

  const el = h('div', { class: 'color-picker' },
    h('div', { class: 'cp-title' }, t('color.standard')),
    swatches,
    h('div', { class: 'cp-title' }, t('color.spectrum')),
    sv,
    hueInput,
    h('div', { class: 'cp-hexrow' }, preview, hex),
  );
  paint();
  setValue(value);
  return { el, setValue };
}

/** Opens a picker in a popover under `anchor`. */
export function openColorPopover(anchor, value, { onInput, onCommit }) {
  const picker = createColorPicker({ value, onInput, onCommit });
  showPopover(anchor, picker.el, { className: 'popover-color' });
}
