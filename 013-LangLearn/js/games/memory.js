
import { GameEngine } from './engine.js';
import { createElement } from '../utils/helpers.js';
import { getContentById } from '../utils/content-manager.js';
import { CURRICULUM } from '../data/curriculum.js';

const TIME_PER_PAIR = 30; // seconds

export class MemoryGame extends GameEngine {
    constructor(config) {
        super(config);
        this.topic = window.app.store.getState().currentTopic;
        this.showTranslation = false;
        this.gridRows = 4;
        this.gridCols = 4;
        this.triesUsed = 0;
        this.initialLives = 0;
    }

    start(container) {
        // Find curriculum group
        let groupId = 'week1-4';
        for (const group of CURRICULUM) {
            if (group.modules && group.modules.some(m => m.id === this.topic)) {
                groupId = group.id;
                break;
            }
        }

        // Determine Grid Size
        const sizes = {
            'week1-4': [[2, 4], [3, 4], [4, 4]],
            'week5-20': [[3, 4], [4, 4], [4, 5], [4, 6], [5, 6], [6, 6]],
            'week24-32': [[4, 4], [4, 5], [4, 6], [4, 7], [5, 6], [5, 7], [6, 6], [6, 7]]
        };

        const possibleSizes = sizes[groupId] || sizes['week1-4'];
        const [rows, cols] = possibleSizes[Math.floor(Math.random() * possibleSizes.length)];
        this.gridRows = rows;
        this.gridCols = cols;

        const pairCount = (rows * cols) / 2;
        this.pairCount = pairCount;

        // Config override for this session
        this.config.timeLimit = TIME_PER_PAIR * pairCount;
        this.config.maxLives = pairCount;

        // Explicitly set engine state BEFORE super.start() which uses checks, 
        // or just rely on super.start() setting defaults then we overwrite.
        // We'll reset everything manually to be safe.

        super.start();

        this.lives = pairCount;
        this.initialLives = pairCount;
        this.timeLeft = TIME_PER_PAIR * pairCount;
        this.triesUsed = 0;
        this.score = 0;

        // Force UI updates immediately
        if (this.onLivesUpdate) this.onLivesUpdate(this.lives, this.triesUsed);
        if (this.onTimeUpdate) this.onTimeUpdate(this.timeLeft);
        if (this.onScoreUpdate) this.onScoreUpdate(this.score);

        this.container = container;

        this.initGame();
        this.renderGrid();
    }

    initGame() {
        const allItems = getContentById(this.topic);

        let selectedItems = [];
        if (allItems.length >= this.pairCount) {
            selectedItems = [...allItems].sort(() => Math.random() - 0.5).slice(0, this.pairCount);
        } else {
            while (selectedItems.length < this.pairCount) {
                const remaining = this.pairCount - selectedItems.length;
                const nextBatch = [...allItems].sort(() => Math.random() - 0.5).slice(0, remaining);
                selectedItems = selectedItems.concat(nextBatch);
            }
        }

        const lang = window.app.store.getState().currentLanguage || 'es';

        let deck = [];
        selectedItems.forEach(item => {
            deck.push({
                id: item.id,
                content: `<div class="image">${item.image}</div>`,
                type: 'image',
                item: item
            });
            deck.push({
                id: item.id,
                content: `<div class="word">${item.translation[lang] || item.word}</div>`,
                type: 'word',
                item: item,
                lang: lang
            });
        });

        // Shuffle
        deck.sort(() => Math.random() - 0.5);
        this.cards = deck.map((cardData, index) => ({
            ...cardData,
            uniqueId: index,
            isFlipped: false,
            isMatched: false
        }));

        this.flippedCards = [];
        this.matchedPairs = 0;
        this.isLocked = false;
        this.startTimeTaken = Date.now();
    }

    renderGrid() {
        this.container.innerHTML = '';
        const grid = createElement('div', 'grid-container memory-grid');

        grid.style.gridTemplateColumns = `repeat(${this.gridCols}, 1fr) !important`;
        // grid.style.maxWidth = `${this.gridCols * 110}px`; 

        this.cards.forEach(card => {
            const cardEl = createElement('div', `game-card memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`);

            let backContent = card.content;
            if (this.showTranslation && card.type === 'image') {
                const user = window.app.store.getState().currentUser;
                const defaultLang = user.defaultLanguage || 'en';
                const translation = card.item.translation[defaultLang] || card.item.word;
                backContent += `<div class="memory-trans" style="font-size:1.2rem; margin-top:5px; color:#555;">${translation}</div>`;
            }

            cardEl.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">❓</div>
                    <div class="card-back" style="flex-direction:column;">${backContent}</div>
                </div>
            `;

            cardEl.onclick = () => this.flipCard(card, cardEl);
            grid.appendChild(cardEl);
        });

        this.container.appendChild(grid);

        // Controls
        const controlsDiv = createElement('div', 'controls-container');
        controlsDiv.style.cssText = 'margin-top: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px;';

        const user = window.app.store.getState().currentUser;
        const defaultLang = user.defaultLanguage || 'en';

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
            this.renderGrid();
        };

        const resetBtn = createElement('button', 'btn btn-secondary', 'Reset Game');
        resetBtn.onclick = () => {
            // Reset effectively restarts
            this.start(this.container);
        };

        controlsDiv.append(transLabel, resetBtn);
        this.container.appendChild(controlsDiv);
    }

    flipCard(card, element) {
        if (this.isLocked) return;
        if (card.isMatched) return;
        if (card.isFlipped) return;

        // Flip logic
        card.isFlipped = true;
        this.flippedCards.push({ card, element });

        // Speak
        const speakText = card.item.translation[card.lang] || card.item.word;
        this.speak(speakText, card.lang);

        this.renderGrid();

        if (this.flippedCards.length === 2) {
            this.checkForMatch();
        }
    }

    checkForMatch() {
        this.isLocked = true;
        const [first, second] = this.flippedCards;

        // Increment tries used regardless of match result? 
        // "Number of tries used and tries left"
        // Usually flip pair = 1 try.
        this.triesUsed++;

        if (first.card.id === second.card.id) {
            this.handleMatch(first, second);
            // Update UI after match logic (which might add life)
            if (this.onLivesUpdate) this.onLivesUpdate(this.lives, this.triesUsed);
        } else {
            // No Match
            // Lose logic: "Number of tries left should be equal to number of tries given".
            // "When the timer or tries run out show dialog".
            // So we decrement tries left (lives).
            this.lives--;
            if (this.onLivesUpdate) this.onLivesUpdate(this.lives, this.triesUsed);

            setTimeout(() => {
                first.card.isFlipped = false;
                second.card.isFlipped = false;
                this.flippedCards = [];
                this.isLocked = false;
                this.renderGrid();

                if (this.lives <= 0) {
                    this.showGameOverDialog('tries');
                }
            }, 1000);
        }
    }

    handleMatch(first, second) {
        first.card.isMatched = true;
        second.card.isMatched = true;
        this.matchedPairs++;

        // Scoring: "For each correct match, add 10 point to the score and 1 try to the tries left."
        this.addScore(10);
        this.lives++;
        // Note: engine.addScore calls onScoreUpdate. 
        // We assume engine doesn't auto-handle 'lives++' so we explicitly do it and notify.

        this.flippedCards = [];
        this.isLocked = false;

        this.renderGrid();

        if (this.matchedPairs === this.pairCount) {
            const timeToken = ((Date.now() - this.startTimeTaken) / 1000).toFixed(1);
            setTimeout(() => {
                this.showWinDialog(timeToken);
            }, 500);
        }
    }

    // Override engine's loseLife since we handle it in checkForMatch
    loseLife() {
        // We manually handled loose life in checkForMatch to sync with animation delay
    }

    // Override engine's end to handle timeout specifically or quit
    end(reason) {
        super.end(reason);
        if (reason === 'timeout') {
            this.showGameOverDialog('timeout');
        }
    }

    showGameOverDialog(reason) {
        const timeToken = ((Date.now() - this.startTimeTaken) / 1000).toFixed(1);

        const dialog = createElement('div', 'modal-overlay');
        dialog.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); z-index: 2000;
            display: flex; justify-content: center; align-items: center;
        `;

        const reasonText = reason === 'timeout' ? "Time's Up!" : "Out of Tries!";

        dialog.innerHTML = `
            <div class="modal-content card fade-in" style="background: white; padding: 30px; text-align: center; max-width: 400px; border-radius: 15px;">
                <h2 style="color: #e74c3c; margin-bottom: 20px;">Game Over!</h2>
                <h3 style="margin-bottom: 20px;">${reasonText}</h3>
                <div style="text-align: left; margin-bottom: 20px; display: inline-block;">
                    <p>Time Taken: <strong>${timeToken}s</strong></p>
                    <p>Tries Used: <strong>${this.triesUsed}</strong></p>
                    <p>Tries Left: <strong>${this.lives}</strong></p>
                    <p>Score: <strong>${this.score}</strong></p>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="btn-retry" class="btn btn-primary">Try Again</button>
                    <button id="btn-menu" class="btn btn-secondary">Menu</button>
                </div>
            </div>
        `;

        dialog.querySelector('#btn-retry').onclick = () => {
            dialog.remove();
            this.start(this.container);
        };
        dialog.querySelector('#btn-menu').onclick = () => {
            dialog.remove();
            window.app.router.navigate('game-select');
        };

        this.container.appendChild(dialog);
        this.speak("Game Over", 'en');
        super.end('gameover_dialog_shown'); // Stop timer
    }

    showWinDialog(timeToken) {
        const dialog = createElement('div', 'modal-overlay');
        dialog.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); z-index: 2000;
            display: flex; justify-content: center; align-items: center;
        `;

        dialog.innerHTML = `
            <div class="modal-content card fade-in" style="background: white; padding: 30px; text-align: center; max-width: 400px; border-radius: 15px;">
                <h2 style="color: var(--primary-color); margin-bottom: 20px;">Congratulations! You won!</h2>
                <div style="text-align: left; margin-bottom: 20px; display: inline-block;">
                    <p>Time: <strong>${timeToken}s</strong></p>
                    <p>Score: <strong>${this.score}</strong></p>
                    <p>Tries Used: <strong>${this.triesUsed}</strong></p>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="btn-play-again" class="btn btn-primary">Play Again</button>
                    <button id="btn-menu" class="btn btn-secondary">Menu</button>
                </div>
            </div>
        `;

        dialog.querySelector('#btn-play-again').onclick = () => {
            dialog.remove();
            this.start(this.container);
        };

        dialog.querySelector('#btn-menu').onclick = () => {
            dialog.remove();
            window.app.router.navigate('game-select');
        };

        this.container.appendChild(dialog);
        this.speak("Congratulations!", 'en');
        super.end('completed');
    }
}
