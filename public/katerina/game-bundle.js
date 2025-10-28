// Katerina's Birthday Game - Bundled Version (No ES6 Modules)
(function() {
    'use strict';

    // Game Configuration
    const gameConfig = {
        player: {
            width: 100,
            height: 120,
            jumpPower: 16,
            maxJumps: 3,
            spriteScale: 3,
            sprites: {
                upper: [
                    [0, 0, 0, '#8b6f47', '#a0826d', '#b8956a', '#b8956a', '#a0826d', '#8b6f47', 0, 0, 0],
                    [0, 0, '#8b6f47', '#b8956a', '#c9a876', '#d4b896', '#d4b896', '#c9a876', '#b8956a', '#8b6f47', 0, 0],
                    [0, '#8b6f47', '#a0826d', '#c9a876', '#d4b896', '#e8d4b0', '#e8d4b0', '#d4b896', '#c9a876', '#a0826d', '#8b6f47', 0],
                    [0, '#b8956a', '#c9a876', '#d4b896', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#d4b896', '#c9a876', '#b8956a', 0],
                    ['#8b6f47', '#c9a876', '#d4b896', '#ffdbac', '#333', '#fff', '#fff', '#333', '#ffdbac', '#d4b896', '#c9a876', '#8b6f47'],
                    ['#a0826d', '#c9a876', '#ffdbac', '#ffdbac', '#ffdbac', '#ffc0cb', '#ffc0cb', '#ffdbac', '#ffdbac', '#ffdbac', '#c9a876', '#a0826d'],
                    ['#b8956a', '#d4b896', '#ffdbac', '#ffdbac', '#ff9999', '#ff9999', '#ff9999', '#ff9999', '#ffdbac', '#ffdbac', '#d4b896', '#b8956a'],
                    ['#c9a876', '#d4b896', '#e8d4b0', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#e8d4b0', '#d4b896', '#c9a876'],
                    ['#b8956a', '#c9a876', '#d4b896', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#d4b896', '#c9a876', '#b8956a'],
                    ['#a0826d', '#b8956a', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#b8956a', '#a0826d'],
                    ['#8b6f47', '#a0826d', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#a0826d', '#8b6f47'],
                    ['#8b6f47', '#a0826d', '#1d3557', '#1d3557', '#1d3557', '#fff', '#fff', '#1d3557', '#1d3557', '#1d3557', '#a0826d', '#8b6f47'],
                    ['#8b6f47', '#b8956a', '#1d3557', '#1d3557', '#1d3557', '#fff', '#fff', '#1d3557', '#1d3557', '#1d3557', '#b8956a', '#8b6f47'],
                    ['#8b6f47', '#b8956a', '#1d3557', '#1d3557', '#1d3557', '#fff', '#fff', '#1d3557', '#1d3557', '#1d3557', '#b8956a', '#8b6f47'],
                    ['#8b6f47', '#a0826d', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#a0826d', '#8b6f47'],
                    [0, '#8b6f47', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#8b6f47', 0],
                    [0, '#8b6f47', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#8b6f47', 0],
                    [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
                    [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
                    [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0]
                ],
                lower: [
                    [
                        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, '#333', '#333', '#333', 0, 0, '#333', '#333', '#333', 0, 0],
                        [0, '#333', '#333', '#333', '#333', 0, 0, '#333', '#333', '#333', '#333', 0],
                        [0, '#333', '#333', '#333', 0, 0, 0, '#333', '#333', '#333', 0, 0]
                    ],
                    [
                        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0],
                        [0, 0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0],
                        [0, 0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
                        [0, 0, 0, '#333', '#333', '#333', 0, 0, '#333', '#333', '#333', 0],
                        [0, 0, '#333', '#333', '#333', '#333', 0, 0, '#333', '#333', '#333', '#333'],
                        [0, 0, 0, '#333', '#333', '#333', 0, 0, 0, '#333', '#333', '#333']
                    ]
                ]
            }
        },
        obstacles: {
            spawnInterval: 80,
            spawnVariation: 50,
            sprites: {
                column: {
                    pixels: [
                        [0, 0, '#e8e8e8', '#e8e8e8', '#e8e8e8', '#e8e8e8', 0, 0],
                        [0, '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', 0],
                        [0, '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', 0],
                        [0, 0, '#e8e8e8', '#e8e8e8', '#e8e8e8', '#e8e8e8', 0, 0],
                        [0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],
                        [0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],
                        [0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],
                        [0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],
                        [0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],
                        [0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],
                        [0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],
                        [0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],
                        [0, 0, '#e8e8e8', '#e8e8e8', '#e8e8e8', '#e8e8e8', 0, 0],
                        [0, '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', 0],
                        [0, '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', 0]
                    ],
                    scale: 5,
                    width: 40,
                    height: 75
                }
            }
        },
        difficulty: {
            baseSpeed: 6.5,
            gravity: 0.8,
            speedIncreaseFactor: 0.5,
            speedIncreaseInterval: 3
        },
        text: {
            title: '🎉 HAPPY BIRTHDAY KATERINA! 🎂',
            instruction: 'Help Katerina design the future of Ekinox & Eurobank!',
            subtitle: 'Tap to jump (triple jump for innovation sprints!)'
        }
    };

    // Initialize the game
    function initGame() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Game state
        let gameState = 'START';
        let score = 0;
        let gameSpeed = gameConfig.difficulty.baseSpeed;
        let animationFrame = 0;
        let obstacles = [];
        let obstacleTimer = 0;
        
        const player = {
            x: 100,
            y: canvas.height - 170,
            width: gameConfig.player.width,
            height: gameConfig.player.height,
            velocityY: 0,
            jumping: false,
            groundY: canvas.height - 170,
            jumpCount: 0,
            maxJumps: gameConfig.player.maxJumps
        };

        const groundY = canvas.height - 80;

        // Input handling
        function handleInput() {
            if (gameState === 'START') {
                gameState = 'PLAYING';
            } else if (gameState === 'PLAYING') {
                if (player.jumpCount < player.maxJumps) {
                    player.velocityY = -gameConfig.player.jumpPower;
                    player.jumping = true;
                    player.jumpCount++;
                }
            } else if (gameState === 'GAME_OVER') {
                resetGame();
            }
        }

        canvas.addEventListener('click', handleInput);
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleInput();
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handleInput();
            }
        });

        function resetGame() {
            gameState = 'PLAYING';
            score = 0;
            gameSpeed = gameConfig.difficulty.baseSpeed;
            obstacles = [];
            obstacleTimer = 0;
            player.y = player.groundY;
            player.velocityY = 0;
            player.jumping = false;
            player.jumpCount = 0;
        }

        function updatePlayer() {
            player.velocityY += gameConfig.difficulty.gravity;
            player.y += player.velocityY;

            if (player.y >= player.groundY) {
                player.y = player.groundY;
                player.velocityY = 0;
                player.jumping = false;
                player.jumpCount = 0;
            }
        }

        function createObstacle() {
            obstacles.push({
                x: canvas.width,
                y: groundY - 75,
                width: 40,
                height: 75,
                type: 'column'
            });
        }

        function updateObstacles() {
            obstacleTimer++;
            
            const interval = gameConfig.obstacles.spawnInterval + Math.random() * gameConfig.obstacles.spawnVariation;
            if (obstacleTimer > interval) {
                createObstacle();
                obstacleTimer = 0;
            }

            obstacles = obstacles.filter(obstacle => {
                obstacle.x -= gameSpeed;
                
                if (obstacle.x + obstacle.width < 0) {
                    score++;
                    if (score > 10 && score % gameConfig.difficulty.speedIncreaseInterval === 0) {
                        gameSpeed += gameConfig.difficulty.speedIncreaseFactor;
                    }
                    return false;
                }
                return true;
            });
        }

        function checkCollision() {
            return obstacles.some(obstacle => {
                const marginX = 10;
                const marginY = 15;
                
                return player.x + marginX < obstacle.x + obstacle.width &&
                       player.x + player.width - marginX > obstacle.x &&
                       player.y + marginY < obstacle.y + obstacle.height &&
                       player.y + player.height - marginY > obstacle.y;
            });
        }

        function drawPixelArt(x, y, pixels, scale) {
            pixels.forEach((row, i) => {
                row.forEach((color, j) => {
                    if (color) {
                        ctx.fillStyle = color;
                        ctx.fillRect(x + j * scale, y + i * scale, scale, scale);
                    }
                });
            });
        }

        function drawPlayer() {
            const runCycle = Math.floor(animationFrame / 10) % 2;
            const playerSprite = [
                ...gameConfig.player.sprites.upper,
                ...gameConfig.player.sprites.lower[runCycle]
            ];
            drawPixelArt(player.x, player.y - 10, playerSprite, gameConfig.player.spriteScale);
        }

        function drawObstacle(obstacle) {
            const sprite = gameConfig.obstacles.sprites[obstacle.type];
            drawPixelArt(obstacle.x, obstacle.y, sprite.pixels, sprite.scale);
        }

        function drawBackground() {
            // Sky
            ctx.fillStyle = '#87ceeb';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Ground
            ctx.fillStyle = '#8B7355';
            ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
            
            // Grass
            ctx.fillStyle = '#228B22';
            for (let i = 0; i < canvas.width; i += 20) {
                ctx.fillRect(i, groundY - 5, 10, 5);
            }
        }

        function drawUI() {
            if (gameState === 'START') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 48px "Courier New"';
                ctx.textAlign = 'center';
                ctx.fillText(gameConfig.text.title, canvas.width / 2, canvas.height / 2 - 80);
                
                ctx.font = '24px "Courier New"';
                ctx.fillText(gameConfig.text.instruction, canvas.width / 2, canvas.height / 2 - 10);
                
                ctx.font = '20px "Courier New"';
                ctx.fillText(gameConfig.text.subtitle, canvas.width / 2, canvas.height / 2 + 40);
                
                ctx.font = '18px "Courier New"';
                ctx.fillText('Tap to start', canvas.width / 2, canvas.height / 2 + 80);
                
            } else if (gameState === 'PLAYING') {
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "Courier New"';
                ctx.textAlign = 'left';
                ctx.fillText(`Score: ${score}`, 20, 40);
                
                ctx.fillStyle = player.jumpCount === 0 ? '#4dabf7' : (player.jumpCount === 1 ? '#ffa500' : (player.jumpCount === 2 ? '#ff6b6b' : '#999'));
                ctx.fillText(`Jumps: ${'●'.repeat(player.maxJumps - player.jumpCount)}${'○'.repeat(player.jumpCount)}`, 20, 70);
                
            } else if (gameState === 'GAME_OVER') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 48px "Courier New"';
                ctx.textAlign = 'center';
                ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 80);
                
                ctx.font = '32px "Courier New"';
                ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 10);
                
                ctx.font = '20px "Courier New"';
                ctx.fillText('Tap to restart', canvas.width / 2, canvas.height / 2 + 40);
            }
        }

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            drawBackground();
            
            if (gameState === 'START') {
                drawPlayer();
                drawUI();
                
            } else if (gameState === 'PLAYING') {
                updatePlayer();
                updateObstacles();
                animationFrame++;
                
                obstacles.forEach(drawObstacle);
                drawPlayer();
                
                if (checkCollision()) {
                    gameState = 'GAME_OVER';
                }
                
                drawUI();
                
            } else if (gameState === 'GAME_OVER') {
                obstacles.forEach(drawObstacle);
                drawPlayer();
                drawUI();
            }
            
            requestAnimationFrame(gameLoop);
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            player.groundY = canvas.height - 170;
            if (!player.jumping) {
                player.y = player.groundY;
            }
        });

        // Start game loop
        gameLoop();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }
})();
