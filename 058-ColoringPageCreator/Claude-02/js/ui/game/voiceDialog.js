/** Lets the child (or parent) pick the narration voice from the voices installed on this device. */
import { h } from '../../core/util.js';
import { t, getLanguage } from '../../core/i18n.js';
import { modal } from '../dialog.js';
import { listVoices, getVoiceChoice, setVoiceChoice, speak } from '../../game/audio.js';

export async function voiceDialog() {
  const voices = await listVoices();
  const choice = getVoiceChoice();
  const lang = (getLanguage() || 'en').toLowerCase().split('-')[0];

  if (!voices.length) {
    return modal({ title: t('game.voice'), content: h('p', {}, t('game.noVoices')), actions: [{ label: t('common.close'), primary: true }] });
  }

  const option = (v) => h('option', { value: v.voiceURI, selected: v.voiceURI === choice.voiceURI }, `${v.name} (${v.lang})${v.localService ? '' : ' ☁'}`);
  const sorted = [...voices].sort((a, b) => a.name.localeCompare(b.name));
  const mine = sorted.filter((v) => v.lang.toLowerCase().startsWith(lang));
  const others = sorted.filter((v) => !mine.includes(v));

  const select = h('select', { class: 'field', 'aria-label': t('game.voice') },
    h('option', { value: '' }, t('game.voiceAuto')),
    mine.length ? h('optgroup', { label: t('game.voiceYourLanguage') }, mine.map(option)) : null,
    others.length ? h('optgroup', { label: t('game.voiceOthers') }, others.map(option)) : null,
  );
  const speed = h('input', { type: 'range', min: 0.6, max: 1.4, step: 0.05, value: choice.rate, 'aria-label': t('game.voiceSpeed') });
  const apply = () => setVoiceChoice({ voiceURI: select.value || null, rate: speed.value });
  const test = () => {
    apply();
    speak(t('game.voiceSample'), { force: true });
  };
  select.addEventListener('change', test);
  speed.addEventListener('change', test);

  return modal({
    title: `🗣️ ${t('game.voice')}`,
    content: h('div', { class: 'voice-form' },
      h('label', { class: 'form-row' }, h('span', {}, t('game.voice')), select),
      h('label', { class: 'form-row' }, h('span', {}, t('game.voiceSpeed')), speed),
      h('p', { class: 'hint' }, t('game.voiceHint')),
    ),
    actions: [
      { label: `🔊 ${t('game.voiceTest')}`, onClick: test },
      { label: t('common.ok'), primary: true, onClick: (close) => (apply(), close(true)) },
    ],
  });
}
