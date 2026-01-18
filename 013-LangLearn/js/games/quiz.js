
import { GameEngine } from './engine.js';
import { createElement } from '../utils/helpers.js';
import { getContentById } from '../utils/content-manager.js';

export class QuizGame extends GameEngine {
    constructor(config) {
        super(config);
        const topic = window.app.store.getState().currentTopic;
        this.items = [...getContentById(topic)];
        // Shuffle items for random order
        this.items.sort(() => Math.random() - 0.5);
        this.currentIndex = 0;
        this.score = 0;
        this.showTranslation = true;
    }

    start(container) {
        super.start();
        this.container = container;
        this.renderQuestion();
    }

    renderQuestion() {
        this.container.innerHTML = '';

        if (this.currentIndex >= this.items.length) {
            this.end('completed');
            return;
        }

        const currentItem = this.items[this.currentIndex];
        const lang = window.app.store.getState().currentLanguage || 'es';
        const user = window.app.store.getState().currentUser;
        const defaultLang = user.defaultLanguage || 'en';

        // Question: "Which one is [WORD]?"
        // We need 1 correct answer + 3 distractors
        const options = this.generateOptions(currentItem);

        const wordToAsk = currentItem.translation[lang] || currentItem.word;

        // Title Container
        const titleDiv = createElement('div', 'question-header');
        titleDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px;';

        const titleText = createElement('h2', 'question-title', `Which one is <span class="word-to-ask">"${wordToAsk}"</span>?`);
        titleText.style.margin = '0';

        const soundBtn = createElement('button', 'btn-icon sound-btn', '🔊');
        soundBtn.style.fontSize = '1.5rem';
        soundBtn.onclick = () => this.speak(wordToAsk, lang);

        titleDiv.append(titleText, soundBtn);

        const optionsGrid = createElement('div', 'grid-container');
        optionsGrid.style.justifyItems = 'center';

        options.forEach(opt => {
            const btn = createElement('button', 'game-card');
            btn.style.width = '140px';
            btn.style.height = 'auto';
            btn.style.minHeight = '180px';
            btn.style.padding = '10px';

            // Image
            const imgDiv = createElement('div', 'image');
            imgDiv.innerHTML = opt.image;
            imgDiv.style.fontSize = '6rem';

            // Container for image + potential translation
            const contentDiv = createElement('div', 'card-content');
            contentDiv.style.cssText = 'display: flex; flex-direction: column; flex-flow: column; alignItems: center; gap: 5px;';
            contentDiv.appendChild(imgDiv);

            // Translation (if enabled)
            if (this.showTranslation) {
                const translationText = opt.translation[defaultLang] || opt.word;
                const transRow = createElement('div', 'trans-row');
                transRow.style.cssText = 'display: flex; align-items: center; gap: 5px; font-size: 0.9rem; color: #555; margin-top: 5px;';
                transRow.innerHTML = `
                    <span style="font-size: 1.2rem;">${translationText}</span>
                    <button class="btn-icon sound-btn-xs" style="font-size: 0.8rem; opacity: 0.7;">🔊</button>
                `;
                transRow.querySelector('.sound-btn-xs').onclick = (e) => {
                    e.stopPropagation(); // Prevent clicking the card answer
                    this.speak(translationText, defaultLang);
                };
                contentDiv.appendChild(transRow);
            }

            btn.appendChild(contentDiv);
            btn.onclick = () => this.checkAnswer(opt, currentItem);

            optionsGrid.appendChild(btn);
        });

        // Settings (Checkbox)
        const settingsDiv = createElement('div', 'settings-row');
        settingsDiv.style.cssText = 'margin-top: 30px; display: flex; justify-content: center;';

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
            this.renderQuestion(); // Re-render to update cards
        };
        settingsDiv.appendChild(transLabel);


        this.container.appendChild(titleDiv);
        this.container.appendChild(optionsGrid);
        this.container.appendChild(settingsDiv);

        this.speak(wordToAsk, lang);
    }

    generateOptions(correctItem) {
        // Simple random picker for distractors
        const distractors = this.items
            .filter(i => i.id !== correctItem.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        const options = [correctItem, ...distractors];
        return options.sort(() => Math.random() - 0.5);
    }

    checkAnswer(selected, correct) {
        if (selected.id === correct.id) {
            // Correct!
            this.addScore(10);
            this.speak("Correct!", 'en'); // Feedback
            // Visual feedback could go here
            this.currentIndex++;
            setTimeout(() => this.renderQuestion(), 500);
        } else {
            // Wrong
            this.speak("Try again", 'en');
            this.loseLife();
            // Shake effect or red border?
        }
    }
}
