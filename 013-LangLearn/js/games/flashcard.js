
import { GameEngine } from './engine.js';
import { createElement } from '../utils/helpers.js';
import { getContentById } from '../utils/content-manager.js';

export class FlashcardGame extends GameEngine {
    constructor(config) {
        super(config);
        const topic = window.app.store.getState().currentTopic;
        this.originalItems = getContentById(topic);
        this.items = [...this.originalItems]; // Working copy
        this.currentIndex = 0;

        // Settings
        this.showTranslation = true;
        this.shuffle = false;
    }

    start(container) {
        super.start();
        this.container = container;
        this.currentIndex = 0;
        this.renderCard();
    }

    shuffleItems() {
        if (this.shuffle) {
            // Fisher-Yates shuffle
            for (let i = this.items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.items[i], this.items[j]] = [this.items[j], this.items[i]];
            }
        } else {
            // Restore original order
            this.items = [...this.originalItems];
        }
    }

    async playSequence(word, lang, translation, defaultLang) {
        if (this.isPlayingSequence) return;
        this.isPlayingSequence = true;

        // Play word
        await this.speak(word, lang);

        // Wait 1s
        await new Promise(r => setTimeout(r, 1000));

        // Play translation (if available/shown or just reusing word if needed, but request implied translation logic)
        // User said: "Show the translation in the default language". 
        // Logic: play word -> delay -> play translation
        if (translation) {
            await this.speak(translation, defaultLang);
        }

        this.isPlayingSequence = false;
    }

    renderCard() {
        this.container.innerHTML = '';

        if (this.currentIndex >= this.items.length) {
            // Loop back or end? Usually loop or completion screen. 
            // "Next" suggests generic flow. Let's show completion or restart.
            // For now, let's just loop or show a "Done" message with restart.
            this.container.innerHTML = `
                <div class="game-card fade-in centered">
                    <h2>Great Job! 🎉</h2>
                    <button class="btn btn-primary" onclick="window.app.router.navigate('game-select')">Back to Menu</button>
                    <button class="btn btn-secondary" id="btn-restart">Restart</button>
                </div>
            `;
            this.container.querySelector('#btn-restart').onclick = () => {
                this.currentIndex = 0;
                if (this.shuffle) this.shuffleItems(); // Reshuffle on restart if enabled
                this.renderCard();
            };
            return;
        }

        const item = this.items[this.currentIndex];
        const currentLang = window.app.store.getState().currentLanguage || 'en'; // Target learning language
        const user = window.app.store.getState().currentUser;
        const defaultLang = user.defaultLanguage || 'en'; // UI language (translation)

        const learningWord = item.translation[currentLang] || item.word;
        // Translation is in default language (UI language)
        // Check if item.translation has defaultLang, else use item.word as fallback
        const translationText = item.translation[defaultLang] || item.word;


        const card = createElement('div', 'game-card fade-in');

        // Main Word Content
        const wordContainer = createElement('div', 'word-container');
        wordContainer.style.textAlign = 'center';

        // Image
        const imageDiv = createElement('div', 'image pointer');
        imageDiv.innerHTML = item.image;
        imageDiv.onclick = () => {
            this.playSequence(learningWord, currentLang, this.showTranslation ? translationText : null, defaultLang);
        };

        // Learning Word + Sound Icon
        const textDiv = createElement('div', 'word-row');
        textDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 3rem; margin: 10px 0;';

        textDiv.innerHTML = `
            <span>${learningWord}</span>
            <button class="btn-icon sound-btn">🔊</button>
        `;
        textDiv.querySelector('.sound-btn').onclick = (e) => {
            e.stopPropagation();
            this.speak(learningWord, currentLang);
        };

        wordContainer.append(imageDiv, textDiv);

        // Translation Section
        if (this.showTranslation) {
            const transDiv = createElement('div', 'trans-row fade-in');
            transDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 1.5rem; color: #666; margin-top: -5px;';
            transDiv.innerHTML = `
                <span>${translationText}</span>
                <button class="btn-icon sound-btn-sm" style="font-size:1rem; opacity:0.7">🔊</button>
            `;
            transDiv.querySelector('.sound-btn-sm').onclick = (e) => {
                e.stopPropagation();
                this.speak(translationText, defaultLang);
            };
            wordContainer.append(transDiv);
        }

        card.appendChild(wordContainer);

        // Controls
        const controlsDiv = createElement('div', 'controls-container');
        controlsDiv.style.marginTop = '30px';
        controlsDiv.style.display = 'flex';
        controlsDiv.style.flexDirection = 'column';
        controlsDiv.style.alignItems = 'center';
        controlsDiv.style.gap = '15px';

        // Next Button
        const nextBtn = createElement('button', 'btn btn-primary btn-lg', 'Next ➡️');
        nextBtn.onclick = () => {
            this.currentIndex++;
            this.renderCard();
        };

        // Settings Checkboxes
        const settingsDiv = createElement('div', 'settings-row');
        settingsDiv.style.cssText = 'display: flex; flex-direction: column; gap: 10px; align-items: flex-start; font-size: 0.9rem;';

        // Checkbox 1: Shuffle
        const shuffleLabel = createElement('label', 'checkbox-label');
        shuffleLabel.style.display = 'flex';
        shuffleLabel.style.alignItems = 'center';
        shuffleLabel.style.gap = '8px';
        shuffleLabel.style.cursor = 'pointer';
        shuffleLabel.innerHTML = `
            <input type="checkbox" ${this.shuffle ? 'checked' : ''}>
            Shuffle words
        `;
        shuffleLabel.querySelector('input').onchange = (e) => {
            this.shuffle = e.target.checked;
            this.currentIndex = 0; // Reset index on shuffle change to apply clean state? 
            // Or just shuffle remaining? User requirement just says "If checked, shuffle". 
            // Usually simpler to reset or shuffle whole deck. Let's restart to be safe/clear.
            this.shuffleItems();
            this.renderCard();
        };

        // Checkbox 2: Show Translation
        const transLabel = createElement('label', 'checkbox-label');
        transLabel.style.display = 'flex';
        transLabel.style.alignItems = 'center';
        transLabel.style.gap = '8px';
        transLabel.style.cursor = 'pointer';
        transLabel.innerHTML = `
            <input type="checkbox" ${this.showTranslation ? 'checked' : ''}>
            Show translation in default language (${this.getLanguageName(defaultLang)})
        `;
        transLabel.querySelector('input').onchange = (e) => {
            this.showTranslation = e.target.checked;
            this.renderCard(); // Re-render to toggle visibility
        };

        settingsDiv.append(transLabel, shuffleLabel);
        controlsDiv.append(nextBtn, settingsDiv);

        this.container.append(card, controlsDiv);
    }
}
