// Input handling for keyboard, touch, and mouse
export class InputManager {
    constructor(canvas, gameEngine) {
        this.canvas = canvas;
        this.engine = gameEngine;
        this.setupListeners();
    }

    setupListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Touch and click events
        this.canvas.addEventListener('click', () => this.handleTap());
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTap();
        });
    }

    handleKeydown(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            if (this.engine.gameState === 'START') {
                this.engine.setState('PLAYING');
            } else if (this.engine.gameState === 'PLAYING') {
                this.engine.jump();
            } else if (this.engine.gameState === 'CREDITS') {
                // Skip credits
                const credits = this.engine.config.credits;
                this.engine.creditsOffset = (credits.length * 300) + this.canvas.height + 300;
            }
        }

        // R key to replay directly
        if (e.code === 'KeyR' && (this.engine.gameState === 'GAME_OVER' || this.engine.gameState === 'CREDITS')) {
            this.engine.resetGame();
        }
    }

    handleTap() {
        if (this.engine.gameState === 'START') {
            this.engine.setState('PLAYING');
        } else if (this.engine.gameState === 'PLAYING') {
            this.engine.jump();
        } else if (this.engine.gameState === 'CREDITS') {
            const credits = this.engine.config.credits;
            this.engine.creditsOffset = (credits.length * 300) + this.canvas.height + 300;
        }
    }
}
