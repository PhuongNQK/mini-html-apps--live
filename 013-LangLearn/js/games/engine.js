import { LANGUAGES } from '../data/languages.js';

export class GameEngine {
    constructor(config) {
        this.config = config; // { timeLimit, maxLives, etc. }
        this.score = 0;
        this.lives = config.maxLives || 5;
        this.timeLeft = config.timeLimit || 0;
        this.isPlaying = false;
        this.timerInterval = null;
        this.gameHeader = null;
        this.gameArea = null;
        this.gameFooter = null;

        // Event callbacks
        this.onScoreUpdate = null;
        this.onLivesUpdate = null;
        this.onTimeUpdate = null;
        this.onGameOver = null;
    }

    initUI({ gameHeader, gameArea, gameFooter }) {
        this.gameHeader = gameHeader;
        this.gameArea = gameArea;
        this.gameFooter = gameFooter;
    }

    start() {
        this.isPlaying = true;
        this.score = 0;
        if (this.config.timeLimit) {
            this.startTime();
        }
        console.log("Game Started");
    }

    pause() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
    }

    resume() {
        if (!this.isPlaying && this.timeLeft > 0) {
            this.isPlaying = true;
            this.startTime();
        }
    }

    end(reason) {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        console.log("Game Over:", reason);
        if (this.onGameOver) this.onGameOver({ score: this.score, reason });
    }

    addScore(points) {
        this.score += points;
        if (this.onScoreUpdate) this.onScoreUpdate(this.score);
    }

    loseLife() {
        this.lives--;
        if (this.onLivesUpdate) this.onLivesUpdate(this.lives);
        if (this.lives <= 0) {
            this.end('lives_out');
        }
    }

    startTime() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            if (this.onTimeUpdate) this.onTimeUpdate(this.timeLeft);
            if (this.timeLeft <= 0) {
                this.end('timeout');
            }
        }, 1000);
    }

    speak(text, lang) {
        return new Promise((resolve) => {
            if ('speechSynthesis' in window) {
                // Cancel any pending speech to avoid queue buildup
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;

                // Handle speech end
                utterance.onend = () => {
                    resolve();
                };

                // Handle errors
                utterance.onerror = (e) => {
                    console.error("Speech error", e);
                    resolve();
                };

                console.log(lang, text);
                window.speechSynthesis.speak(utterance);
            } else {
                resolve();
            }
        });
    }

    getLanguageName(lang) {
        const langObj = LANGUAGES.find(l => l.code === lang);
        return langObj ? langObj.name : lang;
    }
}
