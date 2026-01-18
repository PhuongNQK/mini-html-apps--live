import { createElement } from '../../utils/helpers.js';

export function GameContainerView(params) {
    // This view serves as the shell for ANY game.
    // It handles the Header (Pause, Score), the Game Area, and potentially Footer.

    const gameType = (params && params.gameType) || 'quiz'; // Default fallback

    const container = createElement('div', 'view-container game-wrapper');

    // Header
    const header = createElement('div', 'game-header');
    header.innerHTML = `
        <button id="btn-pause" class="btn btn-secondary">⏸️</button>
        <div class="score-board">
            <span id="score-display">⭐ 0</span>
        </div>
        <div style="display:flex; gap:15px; align-items:center;">
             <div class="timer" id="timer-display" style="font-weight:bold; font-size:1.2rem;"></div>
             <div class="tries" id="tries-display" style="font-weight:bold; font-size:1rem; color:#666;"></div>
        </div>
    `;

    header.querySelector('#btn-pause').onclick = () => {
        if (confirm("Quit game?")) {
            if (container.gameInstance) container.gameInstance.end('quit');
            window.app.router.navigate('game-select');
        }
    };

    // Main Game Area - Games will render into this
    const gameArea = createElement('div', 'game-area');
    gameArea.id = 'game-canvas';

    // Footer
    const footer = createElement('div', 'game-footer');

    container.append(header, gameArea, footer);

    // We need a way to mount the specific game logic here.
    // For now, we'll expose a global helper or listener to init the specific game.
    // Ideally, the Router would pass the game type, and we'd load it.

    // Initialize Game
    setTimeout(async () => {
        const gameAreaEl = container.querySelector('#game-canvas');
        if (!gameAreaEl) return;

        let GameClass;
        let config = { timeLimit: 0, maxLives: 3 };

        try {
            if (gameType === 'memory') {
                const module = await import('../../games/memory.js');
                GameClass = module.MemoryGame;
            } else if (gameType === 'quiz') {
                const module = await import('../../games/quiz.js');
                GameClass = module.QuizGame;
            } else if (gameType === 'flashcard') {
                const module = await import('../../games/flashcard.js');
                GameClass = module.FlashcardGame;
            } else if (gameType === 'alphabet') {
                const module = await import('../../games/alphabet.js');
                GameClass = module.AlphabetGame;
            } else {
                throw new Error("Unknown game type");
            }

            const game = new GameClass(config);

            // Wire up events
            const scoreDisplay = container.querySelector('#score-display');

            game.onScoreUpdate = (score) => {
                scoreDisplay.innerText = `⭐ ${score}`;
                // Play sound
                window.app.audio.play('correct');
            };

            game.onGameOver = (result) => {
                window.app.audio.play('win'); // Simple win sound for now
                alert(`Game Over! Score: ${result.score}`);
                window.app.router.navigate('game-select');
            };

            const timerDisplay = container.querySelector('#timer-display');
            const triesDisplay = container.querySelector('#tries-display');

            game.onTimeUpdate = (time) => {
                const minutes = Math.floor(time / 60);
                const seconds = time % 60;
                timerDisplay.innerText = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
            };

            game.onLivesUpdate = (lives, triesUsed) => {
                // If game supports triesUsed, show it
                if (triesUsed !== undefined) {
                    triesDisplay.innerText = `Tries: ${triesUsed} (Left: ${lives})`;
                } else {
                    triesDisplay.innerText = `❤️ ${lives}`;
                }

                // Only play sound if life lost (old logic was only checking lives)
                // We'll let the game handle sound via specific events or assume simple logic for now
            };

            game.initUI({ gameHeader: header, gameArea, gameFooter: footer });
            game.start(gameAreaEl);
            container.gameInstance = game;

        } catch (e) {
            console.error(e);
            gameAreaEl.innerHTML = `<p>Error loading game ${gameType}</p>`;
        }
    }, 100);

    return container;
}
