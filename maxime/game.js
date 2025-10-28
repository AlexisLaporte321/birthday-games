// Maxime's Birthday Game - Refactored version
import { gameConfig } from './config.js';
import { GameEngine } from '/engine/GameEngine.js';
import { PixelArtRenderer } from '/engine/PixelArtRenderer.js';
import { InputManager } from '/engine/InputManager.js';
import { ScoreManager } from '/engine/ScoreManager.js';
import { UIRenderer } from '/engine/UIRenderer.js';
import { ParisianStreetBackground } from '/backgrounds/ParisianStreet.js';

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize modules
const engine = new GameEngine(canvas, gameConfig);
const renderer = new PixelArtRenderer(ctx);
const scoreManager = new ScoreManager();
const uiRenderer = new UIRenderer(ctx, gameConfig);
const background = new ParisianStreetBackground(ctx);
const inputManager = new InputManager(canvas, engine);

// Fetch leaderboard on load
scoreManager.fetchLeaderboard().then(() => {
    engine.leaderboard = scoreManager.leaderboard;
});

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    background.draw(canvas, engine.groundY, engine.score);
    renderer.drawGround(engine.groundY, canvas, gameConfig, engine.score);

    if (engine.gameState === 'START') {
        renderer.drawPlayer(engine.player, gameConfig, engine.animationFrame);
        uiRenderer.drawStartScreen(canvas, engine.leaderboard);
    } else if (engine.gameState === 'PLAYING') {
        engine.updatePlayer();
        engine.updateObstacles();
        engine.animationFrame++;

        // Draw obstacles
        engine.obstacles.forEach(obstacle => {
            renderer.drawObstacle(obstacle, gameConfig);
        });

        renderer.drawPlayer(engine.player, gameConfig, engine.animationFrame);

        // Check collisions
        if (engine.checkCollision()) {
            engine.gameState = 'GAME_OVER';
            engine.gameOverTimer = 0;
        }

        // Display score and leaderboard
        uiRenderer.drawScore(engine.score, engine.player, engine.leaderboard, canvas);

    } else if (engine.gameState === 'GAME_OVER') {
        // Submit score if it's a top score
        if (scoreManager.isTopScore(engine.score) && !engine.recordSubmitted) {
            engine.recordSubmitted = true;
            scoreManager.showNameInput().then(playerName => {
                scoreManager.submitScore(engine.score, playerName).then(() => {
                    engine.leaderboard = scoreManager.leaderboard;
                });
            });
        }

        // Draw frozen game state
        engine.obstacles.forEach(obstacle => {
            renderer.drawObstacle(obstacle, gameConfig);
        });

        renderer.drawPlayer(engine.player, gameConfig, engine.animationFrame);
        uiRenderer.drawGameOver(canvas, engine.score, engine.leaderboard);

        // Auto-start credits after 2 seconds
        engine.gameOverTimer++;
        if (engine.gameOverTimer > 120) {
            engine.gameState = 'CREDITS';
            engine.creditsOffset = 0;
        }

    } else if (engine.gameState === 'CREDITS') {
        renderer.drawCredits(
            engine.creditsOffset,
            gameConfig.credits,
            gameConfig.obstacles.sprites,
            canvas,
            gameConfig
        );

        // Animation
        engine.creditsOffset += 2;

        // End of credits - return to game over
        if (engine.creditsOffset > (gameConfig.credits.length * 300) + canvas.height + 500) {
            engine.gameState = 'GAME_OVER';
            engine.creditsOffset = 0;
        }
    }

    requestAnimationFrame(gameLoop);
}

// Handle window resize
window.addEventListener('resize', () => {
    engine.resize();
});

// Start game loop
gameLoop();
