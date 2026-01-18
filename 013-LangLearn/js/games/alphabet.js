import { GameEngine } from './engine.js';
import { createElement } from '../utils/helpers.js';
import { ALPHABETS } from '../data/alphabets.js';

export class AlphabetGame extends GameEngine {
    constructor(config) {
        super(config);
        this.lang = window.app.store.getState().currentLanguage || 'en';
        this.data = ALPHABETS[this.lang] || ALPHABETS['en'];
        this.currentScript = null;
        this.autoPlayInterval = null;
    }

    initUI({ gameHeader, gameArea, gameFooter }) {
        super.initUI({ gameHeader, gameArea, gameFooter });

        this.gameArea.classList.remove('alphabet-game-area');
        this.gameArea.classList.add('alphabet-game-area');
    }

    start(container) {
        super.start();
        this.container = container;
        this.initGame();
    }

    initGame() {
        this.container.innerHTML = '';

        // If multiple scripts, show selection
        if (this.data.scripts.length > 1 && !this.currentScript) {
            this.renderScriptSelection();
        } else {
            // Default to first script if not chosen
            if (!this.currentScript) {
                this.currentScript = this.data.scripts[0];
            }
            this.renderGrid();
        }
    }

    renderScriptSelection() {
        const wrapper = createElement('div', 'view-container centered');
        wrapper.innerHTML = `<h2>Choose Script</h2>`;

        const grid = createElement('div', 'grid-container');
        this.data.scripts.forEach(script => {
            const btn = createElement('button', 'btn btn-primary btn-lg');
            btn.innerText = script.name;
            btn.onclick = () => {
                this.currentScript = script;
                this.renderGrid();
            };
            grid.appendChild(btn);
        });

        wrapper.appendChild(grid);
        this.container.appendChild(wrapper);
    }

    renderGrid() {
        this.container.innerHTML = '';

        const header = createElement('h2', '', `Learning: ${this.currentScript.name}`);

        const grid = createElement('div', 'alphabet-grid');

        this.currentScript.letters.forEach((item, index) => {
            const cell = createElement('div', 'alphabet-cell fade-in');
            cell.innerHTML = `
                <div class="char">${item.char}</div>
                <div class="image">${item.image || ''}</div>
                <div class="word">${item.word || ''}</div>
                <button class="btn-sound">🔊</button>
            `;

            // Highlight self on click/speak
            const speak = () => {
                this.speak(item.char, this.lang); // Speak Letter
                // Optional: Speak word too? 
                // setTimeout(() => this.speak(item.word, this.lang), 800);

                // Visual highlight
                cell.style.borderColor = 'var(--accent-color)';
                setTimeout(() => cell.style.borderColor = 'var(--secondary-color)', 500);
            };

            cell.onclick = speak;
            cell.id = `alpha-cell-${index}`;

            grid.appendChild(cell);
        });

        // Auto Read Button
        const controls = createElement('div', 'controls-area');
        controls.style.marginTop = '20px';
        controls.style.textAlign = 'center';

        const btnRead = createElement('button', 'btn btn-lg btn-success', '📢 Read All');
        btnRead.onclick = () => this.readAll();

        // Back to Script Select (if applicable)
        if (this.data.scripts.length > 1) {
            const btnBack = createElement('button', 'btn btn-secondary', 'Change Script');
            btnBack.style.marginLeft = '10px';
            btnBack.onclick = () => {
                this.currentScript = null;
                this.initGame();
            };
            this.gameFooter.appendChild(btnBack);
        }

        this.gameFooter.prepend(btnRead);

        this.container.appendChild(header);
        this.container.appendChild(grid);
    }

    async readAll() {
        if (this.autoPlayInterval) return; // Already playing

        let i = 0;
        const letters = this.currentScript.letters;

        const playNext = () => {
            if (i >= letters.length) {
                this.autoPlayInterval = null;
                return;
            }

            const cell = this.container.querySelector(`#alpha-cell-${i}`);
            if (cell) cell.click(); // Trigger click logic (speak + highlight)

            i++;
            this.autoPlayInterval = setTimeout(playNext, 1500); // Wait 1.5s between letters
        };

        playNext();
    }

    stop() {
        super.stop();
        if (this.autoPlayInterval) clearTimeout(this.autoPlayInterval);
    }
}
