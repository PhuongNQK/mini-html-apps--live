/** Modal dialogs, prompts and toasts (replaces window.prompt / confirm / alert). */
import { h } from '../core/util.js';
import { t } from '../core/i18n.js';

/**
 * @param {{title:string, content:Node|Node[], actions:{label:string, value?:any, primary?:boolean, danger?:boolean, onClick?:(close:Function)=>void}[], className?:string}} opts
 * @returns {Promise<any>} resolves with the clicked action's value (null when dismissed)
 */
export function modal({ title, content, actions = [], className = '' }) {
  return new Promise((resolve) => {
    let done = false;
    const close = (value = null) => {
      if (done) return;
      done = true;
      dlg.close();
      dlg.remove();
      resolve(value);
    };
    const buttons = actions.map((a) =>
      h('button', {
        type: 'button',
        class: `btn ${a.primary ? 'btn-primary' : ''} ${a.danger ? 'btn-danger' : ''}`,
        onClick: () => (a.onClick ? a.onClick(close) : close('value' in a ? a.value : a.label)),
      }, a.label),
    );
    const dlg = h('dialog', { class: `mcc-dialog ${className}` },
      h('div', { class: 'dlg-head' }, h('h2', {}, title), h('button', { type: 'button', class: 'icon-btn', 'aria-label': t('common.close'), onClick: () => close(null) }, '✕')),
      h('div', { class: 'dlg-body' }, content),
      actions.length ? h('div', { class: 'dlg-foot' }, buttons) : null,
    );
    dlg.addEventListener('cancel', (e) => {
      e.preventDefault();
      close(null);
    });
    dlg.addEventListener('mousedown', (e) => e.target === dlg && close(null));
    document.body.append(dlg);
    dlg.showModal();
    dlg.querySelector('input:not([type=hidden]), select, textarea')?.focus();
  });
}

/** Asks for a line of text. Resolves with the trimmed string, or null if cancelled. */
export function promptText({ title, label, value = '', placeholder = '', okLabel = t('common.ok') }) {
  const input = h('input', { type: 'text', class: 'field', value, placeholder, maxlength: 80 });
  const body = h('label', { class: 'form-row' }, h('span', {}, label), input);
  const result = modal({
    title,
    content: body,
    actions: [
      { label: t('common.cancel'), value: null },
      { label: okLabel, primary: true, onClick: (close) => close(input.value.trim() || null) },
    ],
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.closest('dialog').querySelector('.btn-primary').click();
    }
  });
  setTimeout(() => input.select(), 30);
  return result;
}

export async function confirmBox({ title, message, okLabel = t('common.ok'), danger = false }) {
  const result = await modal({
    title,
    content: h('p', { class: 'dlg-message' }, message),
    actions: [
      { label: t('common.cancel'), value: false },
      { label: okLabel, primary: !danger, danger, value: true },
    ],
  });
  return result === true;
}

export function alertBox({ title, message }) {
  return modal({ title, content: h('p', { class: 'dlg-message' }, message), actions: [{ label: t('common.ok'), primary: true, value: true }] });
}

export function toast(message, kind = 'info') {
  const host = document.getElementById('toasts');
  const el = h('div', { class: `toast toast-${kind}`, role: 'status' }, message);
  host.append(el);
  setTimeout(() => el.classList.add('out'), 3200);
  setTimeout(() => el.remove(), 3700);
}
