/** Right panel: name, position/size, opacity, colours (dual palette) and the layer list. */
import { bus, state, activeSlide, beginLive, live, endLive, select } from '../core/store.js';
import { h, round } from '../core/util.js';
import { t } from '../core/i18n.js';
import { itemColors, recolorItem, itemLineColors, recolorLine } from '../model/ops.js';
import { itemSize } from '../model/geometry.js';
import * as cmd from '../editor/commands.js';
import { createColorPicker } from './colorPicker.js';
import { FONTS } from '../data/fonts.js';
import { applyText, isText } from '../model/text.js';

let activePart = null; // original colour being edited, or '*' for all
let colorTarget = 'fill'; // 'fill' | 'line'
let textArea = null;

export function initPropertiesPanel(root) {
  const fields = {}; // numeric inputs, refreshed during live drags

  function selected() {
    const slide = activeSlide();
    return slide ? slide.items.filter((i) => state.selection.includes(i.id)) : [];
  }

  function numberField(key, label, value, disabled) {
    const input = h('input', { type: 'number', class: 'field num', value: round(value, 1), step: key === 'rot' ? 5 : 1, disabled, 'aria-label': label });
    input.addEventListener('change', () => cmd.setProperty(key, Number(input.value)));
    fields[key] = input;
    return h('label', { class: 'num-row' }, h('span', {}, label), input);
  }

  function section(title, ...children) {
    return h('section', { class: 'prop-section' }, h('h3', {}, title), ...children);
  }

  function transformSection(items) {
    const single = items.length === 1 ? items[0] : null;
    const { w, h: hh } = single ? itemSize(single) : { w: 0, h: 0 };
    return section(t('props.transform'), h('div', { class: 'num-grid' },
      numberField('x', 'X', single?.x ?? 0, !single),
      numberField('y', 'Y', single?.y ?? 0, !single),
      numberField('w', t('props.width'), w, !single),
      numberField('h', t('props.height'), hh, !single),
      numberField('rot', t('props.rotation'), single?.rot ?? 0, !single),
    ));
  }

  function opacitySection(items) {
    const value = Math.round((items[0].opacity ?? 1) * 100);
    const out = h('span', { class: 'range-value' }, `${value}%`);
    const range = h('input', { type: 'range', min: 0, max: 100, value, 'aria-label': t('props.opacity') });
    range.addEventListener('input', () => {
      out.textContent = `${range.value}%`;
      beginLive();
      live(() => selected().forEach((i) => (i.opacity = Number(range.value) / 100)));
    });
    range.addEventListener('change', endLive);
    return section(t('props.opacity'), h('div', { class: 'range-row' }, range, out));
  }

  /** Text tools: words, font, size, Bold/Italic/Underline/Strike, alignment and outline. */
  function textSection(items) {
    const texts = items.filter(isText);
    if (!texts.length) return null;
    const single = texts.length === 1 && items.length === 1 ? texts[0] : null;
    const first = texts[0].text;
    const same = (k) => texts.every((i) => i.text[k] === first[k]);

    const area = h('textarea', { class: 'field text-input', rows: 3, maxlength: 2000, disabled: !single, 'aria-label': t('text.content') }, single ? single.text.content : '');
    textArea = area;
    area.addEventListener('input', () => {
      beginLive();
      live(() => single && applyText(single, { content: area.value }));
    });
    area.addEventListener('change', endLive);

    const font = h('select', { class: 'field', 'aria-label': t('text.font'), style: `font-family:${FONTS.find((f) => f.id === first.font)?.css}` },
      FONTS.map((f) => h('option', { value: f.id, selected: same('font') && f.id === first.font, style: `font-family:${f.css}` }, f.label)));
    if (!same('font')) font.selectedIndex = -1;
    font.addEventListener('change', () => cmd.setTextProps({ font: font.value }));

    const size = h('input', { type: 'number', class: 'field num', min: 4, max: 1000, step: 2, value: round(first.size, 0), 'aria-label': t('text.size') });
    size.addEventListener('change', () => cmd.setTextProps({ size: Number(size.value) }));

    const toggle = (key, label, tag) =>
      h('button', {
        type: 'button', class: `fmt-btn ${texts.every((i) => i.text[key]) ? 'active' : ''}`,
        title: t(label), 'aria-label': t(label), 'aria-pressed': texts.every((i) => i.text[key]),
        onClick: () => cmd.setTextProps({ [key]: !texts.every((i) => i.text[key]) }),
      }, h(tag, {}, tag.toUpperCase()));
    const align = (key, icon, label) =>
      h('button', {
        type: 'button', class: `fmt-btn ${same('align') && first.align === key ? 'active' : ''}`,
        title: t(label), 'aria-label': t(label), onClick: () => cmd.setTextProps({ align: key }),
      }, icon);

    const outline = h('input', { type: 'range', min: 0, max: 12, step: 0.5, value: first.strokeW, 'aria-label': t('text.outline') });
    outline.addEventListener('input', () => {
      beginLive();
      live(() => texts.forEach((i) => applyText(i, { strokeW: Number(outline.value) })));
    });
    outline.addEventListener('change', endLive);

    return section(t('text.title'),
      area,
      h('div', { class: 'text-row' }, font, size),
      h('div', { class: 'fmt-row', role: 'group' },
        toggle('bold', 'text.bold', 'b'), toggle('italic', 'text.italic', 'i'), toggle('underline', 'text.underline', 'u'), toggle('strike', 'text.strike', 's'),
        h('span', { class: 'sep' }),
        align('left', '⯇', 'text.alignLeft'), align('center', '≡', 'text.alignCenter'), align('right', '⯈', 'text.alignRight')),
      h('label', { class: 'num-row' }, h('span', {}, t('text.outline')), outline),
      h('p', { class: 'hint' }, t('text.webFontNote')));
  }

  function colorSection(items) {
    const isLine = colorTarget === 'line';
    const colors = new Map();
    items.forEach((i) => (isLine ? itemLineColors(i, colors) : itemColors(i, colors)));
    const recolor = isLine ? recolorLine : recolorItem;

    const targetSwitch = h('div', { class: 'segmented small', role: 'group', 'aria-label': t('props.colors') },
      ['fill', 'line'].map((k) =>
        h('button', {
          type: 'button',
          class: colorTarget === k ? 'active' : '',
          'aria-pressed': colorTarget === k,
          onClick: () => {
            colorTarget = k;
            activePart = null;
            render();
          },
        }, t(`props.target.${k}`))));

    if (!colors.size) return section(t('props.colors'), targetSwitch, h('p', { class: 'hint' }, t('props.noLineColors')));
    if (activePart !== '*' && !colors.has(activePart)) activePart = [...colors.keys()][0];

    const chips = [
      h('button', {
        type: 'button',
        class: `chip chip-all ${activePart === '*' ? 'active' : ''}`,
        title: t('props.allColors'),
        onClick: () => {
          activePart = '*';
          render();
        },
      }, '🌈'),
      ...[...colors].map(([orig, now]) =>
        h('button', {
          type: 'button',
          class: `chip ${activePart === orig ? 'active' : ''}`,
          style: `background:${now}`,
          title: now,
          'aria-label': now,
          onClick: () => {
            activePart = orig;
            render();
          },
        }),
      ),
    ];

    let liveOn = false;
    const apply = (hex) => {
      if (!liveOn) {
        beginLive();
        liveOn = true;
      }
      live(() => selected().forEach((i) => {
        recolor(i, activePart === '*' ? null : activePart, hex);
        // A line colour needs a visible line: give text an outline the first time one is chosen.
        if (isLine && isText(i) && !i.text.strokeW) applyText(i, { strokeW: Math.max(1.5, i.text.size * 0.05) });
      }));
    };
    const picker = createColorPicker({
      value: activePart === '*' ? [...colors.values()][0] : colors.get(activePart),
      onInput: apply,
      onCommit: () => {
        if (liveOn) endLive();
        liveOn = false;
      },
    });

    const note = state.deck.view.mode === 'uncolored' ? h('p', { class: 'hint warn' }, t('props.colorHintUncolored')) : null;
    return section(t('props.colors'),
      targetSwitch,
      h('p', { class: 'hint' }, t(isLine ? 'props.lineHint' : 'props.partHint')),
      h('div', { class: 'chips' }, chips),
      picker.el,
      note,
      h('button', { type: 'button', class: 'btn btn-small', onClick: cmd.resetSelectedColors }, `↺ ${t('props.resetColors')}`),
    );
  }

  function layersSection() {
    const slide = activeSlide();
    const rows = [...slide.items].reverse().map((item) =>
      h('div', { class: `layer ${state.selection.includes(item.id) ? 'active' : ''}` },
        h('button', {
          type: 'button',
          class: 'layer-name',
          onClick: (e) => {
            const additive = e.shiftKey || e.ctrlKey || e.metaKey;
            select(additive ? (state.selection.includes(item.id) ? state.selection.filter((s) => s !== item.id) : [...state.selection, item.id]) : [item.id]);
          },
        }, item.type === 'group' ? '🗂️ ' : '🖼️ ', item.name),
        h('button', {
          type: 'button',
          class: 'mini-btn',
          title: item.locked ? t('props.unlock') : t('props.lock'),
          'aria-label': item.locked ? t('props.unlock') : t('props.lock'),
          onClick: () => cmd.toggleLock(item.id),
        }, item.locked ? '🔒' : '🔓'),
        state.selection.includes(item.id)
          ? h('button', {
              type: 'button',
              class: 'mini-btn danger',
              title: t('props.deleteLayer'),
              'aria-label': t('props.deleteLayer'),
              onClick: () => cmd.removeItem(item.id),
            }, '🗑️')
          : null,
      ),
    );
    return section(t('props.layers'), rows.length ? h('div', { class: 'layers' }, rows) : h('p', { class: 'hint' }, t('props.noLayers')));
  }

  function render() {
    const items = selected();
    const children = [h('div', { class: 'panel-title' }, `🎛️ ${t('props.title')}`)];
    if (!items.length) {
      children.push(h('p', { class: 'hint pad' }, t('props.nothingSelected')), layersSection());
    } else {
      const single = items.length === 1 ? items[0] : null;
      const nameInput = h('input', { type: 'text', class: 'field', value: single ? single.name : t('props.multi', { n: items.length }), disabled: !single, maxlength: 60, 'aria-label': t('props.name') });
      nameInput.addEventListener('change', () => single && cmd.renameItem(single.id, nameInput.value));
      children.push(
        section(t('props.name'), nameInput),
        transformSection(items),
        textSection(items),
        opacitySection(items),
        colorSection(items),
        layersSection(),
      );
    }
    root.replaceChildren(...children.filter(Boolean));
  }

  /** During drags only refresh the numbers (keeps focus & avoids rebuilding the picker). */
  function refreshValues() {
    const items = selected();
    if (items.length !== 1) return;
    const it = items[0];
    const { w, h: hh } = itemSize(it);
    const values = { x: it.x, y: it.y, w, h: hh, rot: it.rot };
    for (const [key, input] of Object.entries(fields)) if (document.activeElement !== input && key in values) input.value = round(values[key], 1);
  }

  bus.on('editText', () => requestAnimationFrame(() => (textArea?.focus(), textArea?.select())));
  bus.on('selection', render);
  bus.on('deck', render);
  bus.on('slide', render);
  bus.on('view', render);
  bus.on('live', refreshValues);
  render();
  return { rebuild: render };
}
