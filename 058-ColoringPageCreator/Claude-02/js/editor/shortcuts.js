/** Global keyboard shortcuts. Ignored while typing in a field or while a dialog is open. */
import { undo, redo, select, state } from '../core/store.js';
import * as cmd from './commands.js';
import { saveNow } from '../services/persistence.js';

export function initShortcuts() {
  document.addEventListener('keydown', (e) => {
    const target = e.target;
    const typing = target.closest?.('input, textarea, select, [contenteditable="true"]');
    const ctrl = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    if (ctrl && key === 's') {
      e.preventDefault();
      saveNow();
      return;
    }
    if (typing || document.body.classList.contains('game-open') || document.querySelector('dialog[open]')) return;

    if (ctrl && key === 'z') {
      e.preventDefault();
      e.shiftKey ? redo() : undo();
    } else if (ctrl && key === 'y') {
      e.preventDefault();
      redo();
    } else if (ctrl && key === 'a') {
      e.preventDefault();
      cmd.selectAll();
    } else if (ctrl && key === 'd') {
      e.preventDefault();
      cmd.duplicateSelected();
    } else if (ctrl && key === 'g') {
      e.preventDefault();
      e.shiftKey ? cmd.ungroupSelected() : cmd.groupSelected();
    } else if (key === 'delete' || key === 'backspace') {
      e.preventDefault();
      cmd.removeSelected();
    } else if (key === 'escape') {
      select([]);
    } else if (key.startsWith('arrow') && state.selection.length) {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      cmd.nudge(key === 'arrowleft' ? -step : key === 'arrowright' ? step : 0, key === 'arrowup' ? -step : key === 'arrowdown' ? step : 0);
    }
  });
}
