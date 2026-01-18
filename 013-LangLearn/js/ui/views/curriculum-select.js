
import { createElement } from '../../utils/helpers.js';
import { LANGUAGES } from '../../data/languages.js';
import { CURRICULUM } from '../../data/curriculum.js';

export function CurriculumSelectView() {
    const store = window.app.store.getState();
    const container = createElement('div', 'view-container');
    const langCode = store.currentLanguage;
    const lang = LANGUAGES.find(l => l.code === langCode);

    // If no language selected (e.g. direct access), redirect to dashboard
    if (!lang) {
        window.setTimeout(() => window.app.router.navigate('dashboard'), 0);
        return container;
    }

    const header = createElement('div', 'dashboard-header');
    header.innerHTML = `
        <button id="btn-back" class="btn btn-text">← Back</button>
        <h2>${lang.flag} ${lang.name}</h2>
    `;
    header.querySelector('#btn-back').onclick = () => window.app.router.navigate('dashboard');

    const roadmap = createElement('div', 'section-container');
    roadmap.innerHTML = `<h3>Your Journey</h3>`;

    CURRICULUM.forEach(weekGroup => {
        const groupEl = createElement('div', 'curriculum-group card fade-in');
        groupEl.style.marginBottom = '20px';
        groupEl.style.textAlign = 'left';

        groupEl.innerHTML = `
            <h4 style="margin:0 0 10px 0; color:var(--primary-color)">${weekGroup.title}</h4>
            <div style="font-size:0.9rem; margin-bottom:10px">${weekGroup.description}</div>
            <div class="week-modules grid-container" style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap:10px; padding:0;"></div>
        `;

        const modulesGrid = groupEl.querySelector('.week-modules');

        weekGroup.modules.forEach(mod => {
            const btn = createElement('button', 'btn btn-secondary');
            btn.innerText = mod.name;
            btn.onclick = () => {
                window.app.store.setState({ currentTopic: mod.id });
                window.app.router.navigate('game-select');
            };
            modulesGrid.appendChild(btn);
        });

        roadmap.appendChild(groupEl);
    });

    container.append(header, roadmap);
    return container;
}
