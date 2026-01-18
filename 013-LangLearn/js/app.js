import { Database } from './core/db.js';
import { Router } from './core/router.js';
import { Store } from './core/store.js';

import { AudioManager } from './utils/audio.js';

class App {
    constructor() {
        this.db = new Database();
        this.router = new Router('app');
        this.store = new Store();
        this.audio = new AudioManager();
    }

    async init() {
        // Initialize DB
        await this.db.init();

        // Setup Routes
        this.setupRoutes();

        // Check for existing users
        const users = await this.db.getUsers();

        if (users.length > 0) {
            // If users exist, go to profile select (Step 2)
            // For now, just log it and go to a placeholder
            console.log("Users found:", users);
            this.router.navigate('welcome');
        } else {
            // Go to Welcome/Create User
            this.router.navigate('welcome');
        }
    }

    setupRoutes() {
        this.router.addRoute('welcome', async () => {
            const { WelcomeView } = await import('./ui/views/welcome.js');
            return WelcomeView();
        });

        this.router.addRoute('dashboard', async () => {
            const { DashboardView } = await import('./ui/views/dashboard.js');
            return DashboardView();
        });

        this.router.addRoute('game-select', async () => {
            const { GameSelectView } = await import('./ui/views/game-select.js');
            return GameSelectView();
        });

        this.router.addRoute('curriculum-select', async () => {
            const { CurriculumSelectView } = await import('./ui/views/curriculum-select.js');
            return CurriculumSelectView();
        });

        this.router.addRoute('game', async (params) => {
            const { GameContainerView } = await import('./ui/views/game-container.js');
            return GameContainerView(params); // Pass params (gameType)
        });
    }
}

// Global instance
window.app = new App();
window.app.init().catch(err => console.error("App Init Error:", err));
