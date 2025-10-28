// Core game engine - manages game state, loop, and coordination
export class GameEngine {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = config;

        // Normalize game speed based on screen width
        const BASE_SCREEN_WIDTH = 1920;
        this.speedMultiplier = canvas.width / BASE_SCREEN_WIDTH;

        // Game state
        this.gameState = 'START'; // START, PLAYING, GAME_OVER, CREDITS
        this.score = 0;
        this.gameSpeed = config.difficulty.baseSpeed * this.speedMultiplier;
        this.animationFrame = 0;
        this.gameOverTimer = 0;
        this.creditsOffset = 0;
        this.recordSubmitted = false;

        // Player state
        this.player = {
            x: 100,
            y: canvas.height - 170,
            width: config.player.width,
            height: config.player.height,
            velocityY: 0,
            jumping: false,
            groundY: canvas.height - 170,
            jumpCount: 0,
            maxJumps: config.player.maxJumps
        };

        // Obstacles
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.comboTimer = 0;
        this.tripleCombo = false;
        this.mixedHeightPattern = false;

        // Collectibles
        this.collectibles = [];
        this.collectibleTimer = 0;

        // Leaderboard
        this.leaderboard = [];

        // Ground level
        this.groundY = canvas.height - 80;
    }

    setState(newState) {
        this.gameState = newState;
    }

    resetGame() {
        this.score = 0;
        this.gameSpeed = this.config.difficulty.baseSpeed * this.speedMultiplier;
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.comboTimer = 0;
        this.tripleCombo = false;
        this.mixedHeightPattern = false;
        this.collectibles = [];
        this.collectibleTimer = 0;
        this.gameOverTimer = 0;
        this.creditsOffset = 0;
        this.recordSubmitted = false;
        this.player.y = this.player.groundY;
        this.player.velocityY = 0;
        this.player.jumping = false;
        this.player.jumpCount = 0;
        this.gameState = 'PLAYING';
    }

    updatePlayer() {
        this.player.velocityY += this.config.difficulty.gravity;
        this.player.y += this.player.velocityY;

        if (this.player.y >= this.player.groundY) {
            this.player.y = this.player.groundY;
            this.player.velocityY = 0;
            this.player.jumping = false;
            this.player.jumpCount = 0;
        }
    }

    jump() {
        if (this.gameState === 'PLAYING' && this.player.jumpCount < this.player.maxJumps) {
            this.player.velocityY = -this.config.player.jumpPower;
            this.player.jumping = true;
            this.player.jumpCount++;
        }
    }

    createObstacle() {
        const types = Object.keys(this.config.obstacles.sprites);
        const type = types[Math.floor(Math.random() * types.length)];
        const sprite = this.config.obstacles.sprites[type];

        let yPos;
        if (type === 'postit' || sprite.flying) {
            // Flying obstacles
            yPos = this.groundY - 150 - Math.random() * 50;
        } else {
            // Ground obstacles
            yPos = this.groundY - sprite.height;
        }

        this.obstacles.push({
            x: this.canvas.width,
            y: yPos,
            width: sprite.width,
            height: sprite.height,
            type: type
        });
    }

    updateObstacles() {
        this.obstacleTimer++;

        const currentInterval = this.config.obstacles.spawnInterval +
                               Math.random() * this.config.obstacles.spawnVariation;

        if (this.obstacleTimer > currentInterval) {
            this.createObstacle();

            // Create different patterns based on difficulty
            const pattern = Math.random();

            if (pattern < 0.25) {
                // Double obstacle pattern (25% chance)
                this.comboTimer = 25 + Math.random() * 15;
            } else if (pattern < 0.35 && this.score > 20) {
                // Triple obstacle pattern for advanced players (10% chance)
                this.comboTimer = 20;
                this.tripleCombo = true;
            } else if (pattern < 0.45 && this.score > 10) {
                // Mixed height pattern (10% chance)
                this.comboTimer = 35;
                this.mixedHeightPattern = true;
            }

            this.obstacleTimer = 0;
        }

        // Combo management
        if (this.comboTimer > 0) {
            this.comboTimer--;

            // Triple combo second obstacle
            if (this.tripleCombo && this.comboTimer === 10) {
                this.createObstacle();
            }

            // Final obstacle in pattern
            if (this.comboTimer === 0) {
                this.createObstacle();
                this.tripleCombo = false;
                this.mixedHeightPattern = false;
            }
        }

        this.obstacles.forEach((obstacle, index) => {
            obstacle.x -= this.gameSpeed;

            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(index, 1);
                this.score++;

                // Progressive speed increase
                if (this.score > 10 && this.score % this.config.difficulty.speedIncreaseInterval === 0) {
                    this.gameSpeed += this.config.difficulty.speedIncreaseFactor * this.speedMultiplier;
                }
            }
        });
    }

    createCollectible() {
        if (!this.config.collectibles || !this.config.collectibles.sprites) return;

        const types = Object.keys(this.config.collectibles.sprites);
        if (types.length === 0) return;

        const type = types[Math.floor(Math.random() * types.length)];
        const sprite = this.config.collectibles.sprites[type];

        let yPos = this.groundY - 120 - Math.random() * 100;

        this.collectibles.push({
            x: this.canvas.width,
            y: yPos,
            width: sprite.width,
            height: sprite.height,
            type: type,
            points: sprite.points || 5
        });
    }

    updateCollectibles() {
        this.collectibleTimer++;

        // Create collectibles less frequently than obstacles
        if (this.collectibleTimer > 150 + Math.random() * 100) {
            this.createCollectible();
            this.collectibleTimer = 0;
        }

        this.collectibles.forEach((collectible, index) => {
            collectible.x -= this.gameSpeed;

            // Remove if off screen
            if (collectible.x + collectible.width < 0) {
                this.collectibles.splice(index, 1);
            }
        });

        // Check collection
        this.collectibles = this.collectibles.filter(collectible => {
            const marginX = 20;
            const marginY = 20;

            const collected = this.player.x + marginX < collectible.x + collectible.width &&
                             this.player.x + this.player.width - marginX > collectible.x &&
                             this.player.y + marginY < collectible.y + collectible.height &&
                             this.player.y + this.player.height - marginY > collectible.y;

            if (collected) {
                this.score += collectible.points;
                return false; // Remove collected item
            }
            return true; // Keep item
        });
    }

    checkCollision() {
        return this.obstacles.some(obstacle => {
            const marginX = 10;
            const marginY = 15;

            return this.player.x + marginX < obstacle.x + obstacle.width &&
                   this.player.x + this.player.width - marginX > obstacle.x &&
                   this.player.y + marginY < obstacle.y + obstacle.height &&
                   this.player.y + this.player.height - marginY > obstacle.y;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.player.groundY = this.canvas.height - 170;
        this.player.y = this.player.groundY;
        this.groundY = this.canvas.height - 80;

        // Recalculate speed multiplier
        const BASE_SCREEN_WIDTH = 1920;
        this.speedMultiplier = this.canvas.width / BASE_SCREEN_WIDTH;
    }
}
