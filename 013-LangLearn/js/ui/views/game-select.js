import { createElement } from '../../utils/helpers.js';

export function GameSelectView() {
    const store = window.app.store.getState();
    const container = createElement('div', 'view-container centered');

    container.innerHTML = `
        <div class="dashboard-header">
             <button id="btn-back" class="btn btn-text">← Back</button>
             <h2>Let's Play!</h2>
        </div>
        <h2>Topic: ${store.currentTopic}</h2>
        <div class="games-grid">
            <button class="card game-card-select" data-game="flashcard">
                <div class="icon">🃏</div>
                <div class="title">Learn Words</div>
            </button>
            <button class="card game-card-select" data-game="quiz">
                <div class="icon">❓</div>
                <div class="title">Quiz Time</div>
            </button>
            <button class="card game-card-select" data-game="memory">
                <div class="icon">🧠</div>
                <div class="title">Memory Match</div>
            </button>
            <button class="card game-card-select" data-game="alphabet">
                <div class="icon">🔤</div>
                <div class="title">Learn Alphabets</div>
            </button>
        </div>
    `;

    container.querySelector('#btn-back').onclick = () => window.app.router.navigate('curriculum-select');

    container.querySelectorAll('.game-card-select').forEach(btn => {
        btn.onclick = () => {
            const gameType = btn.dataset.game;
            window.app.router.navigate('game', { gameType: gameType });
        };
    });

    return container;
}
