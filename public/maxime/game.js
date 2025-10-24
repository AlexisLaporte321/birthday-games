// Canvas configuration
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let gameState = 'START'; // START, PLAYING, GAME_OVER, CREDITS
let score = 0;
let gameSpeed = 6;
let gravity = 0.8;
let creditsOffset = 0;
let gameOverTimer = 0;

// Character (Maxime + his dog)
const player = {
    x: 100,
    y: canvas.height - 220,
    width: 100,
    height: 120,
    velocityY: 0,
    jumping: false,
    groundY: canvas.height - 220
};

// Obstacles
const obstacles = [];
const obstacleWidth = 40;
const obstacleHeight = 60;
let obstacleTimer = 0;
const obstacleInterval = 120;
let comboTimer = 0;

// Ground
const groundY = canvas.height - 80;

// Sprites pixel art
function drawPixelArt(x, y, pixels, scale = 2) {
    pixels.forEach((row, i) => {
        row.forEach((color, j) => {
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x + j * scale, y + i * scale, scale, scale);
            }
        });
    });
}

// Maxime and his dog (pixel art)
function drawPlayer() {
    const maxime = [
        [0, 0, '#ffdbac', '#ffdbac', '#ffdbac', 0, 0],
        [0, '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', 0],
        [0, '#333', '#fff', '#333', '#333', '#fff', 0],
        [0, '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', 0],
        [0, 0, '#ff6b6b', '#ff6b6b', '#ff6b6b', 0, 0],
        [0, '#4dabf7', '#4dabf7', '#4dabf7', '#4dabf7', '#4dabf7', 0],
        [0, '#4dabf7', '#4dabf7', 0, '#4dabf7', '#4dabf7', 0],
        [0, '#333', '#333', 0, '#333', '#333', 0]
    ];

    const chien = [
        [0, '#8b4513', '#8b4513', 0, 0],
        ['#8b4513', '#8b4513', '#8b4513', '#8b4513', 0],
        ['#333', '#8b4513', '#8b4513', '#8b4513', '#8b4513'],
        [0, '#8b4513', '#8b4513', '#8b4513', 0],
        [0, '#654321', 0, '#654321', 0]
    ];

    drawPixelArt(player.x, player.y, maxime, 6);
    drawPixelArt(player.x + 50, player.y + 60, chien, 6);
}

// Themed obstacle sprites
const obstacleSprites = {
    costume: {
        // Man in suit with tie
        pixels: [
            [0, 0, 0, '#8b6f47', '#8b6f47', '#8b6f47', 0, 0, 0],
            [0, 0, '#8b6f47', '#ffdbac', '#ffdbac', '#ffdbac', '#8b6f47', 0, 0],
            [0, '#8b6f47', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#8b6f47', 0],
            [0, '#8b6f47', '#ffdbac', '#000', '#ffdbac', '#000', '#ffdbac', '#8b6f47', 0],
            [0, 0, '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', 0, 0],
            [0, 0, '#ffdbac', '#000', '#ffdbac', '#000', '#ffdbac', 0, 0],
            [0, 0, 0, '#ffdbac', '#ffdbac', '#ffdbac', 0, 0, 0],
            [0, 0, 0, 0, '#c41e3a', 0, 0, 0, 0],
            [0, 0, 0, '#c41e3a', '#c41e3a', '#c41e3a', 0, 0, 0],
            [0, 0, '#1d3557', '#c41e3a', '#c41e3a', '#c41e3a', '#1d3557', 0, 0],
            [0, '#1d3557', '#1d3557', '#1d3557', '#fff', '#1d3557', '#1d3557', '#1d3557', 0],
            ['#1d3557', '#1d3557', '#1d3557', '#1d3557', '#fff', '#1d3557', '#1d3557', '#1d3557', '#1d3557'],
            ['#1d3557', '#1d3557', '#1d3557', '#1d3557', '#fff', '#1d3557', '#1d3557', '#1d3557', '#1d3557'],
            [0, '#1d3557', '#1d3557', '#1d3557', '#fff', '#1d3557', '#1d3557', '#1d3557', 0],
            [0, 0, '#1d3557', '#1d3557', 0, '#1d3557', '#1d3557', 0, 0],
            [0, 0, '#1d3557', '#1d3557', 0, '#1d3557', '#1d3557', 0, 0],
            [0, 0, '#333', '#333', 0, '#333', '#333', 0, 0]
        ],
        scale: 4,
        width: 36,
        height: 68
    },
    laptop: {
        // Open laptop
        pixels: [
            [0, 0, '#333', '#333', '#333', '#333', '#333', '#333', 0, 0],
            [0, '#333', '#87ceeb', '#87ceeb', '#87ceeb', '#87ceeb', '#87ceeb', '#87ceeb', '#333', 0],
            [0, '#333', '#87ceeb', '#fff', '#fff', '#fff', '#fff', '#87ceeb', '#333', 0],
            [0, '#333', '#87ceeb', '#fff', '#fff', '#fff', '#fff', '#87ceeb', '#333', 0],
            [0, '#333', '#87ceeb', '#333', '#333', '#333', '#333', '#87ceeb', '#333', 0],
            [0, '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', 0],
            ['#666', '#666', '#666', '#666', '#666', '#666', '#666', '#666', '#666', '#666'],
            ['#555', '#555', '#555', '#555', '#555', '#555', '#555', '#555', '#555', '#555']
        ],
        scale: 5,
        width: 50,
        height: 40
    },
    meeting: {
        // Meeting table with 3 people
        pixels: [
            [0, 0, '#ffdbac', '#ffdbac', 0, 0, '#d4a574', '#d4a574', 0, 0, '#f4a261', '#f4a261', 0, 0],
            [0, '#ffdbac', '#000', '#000', '#ffdbac', '#d4a574', '#000', '#000', '#d4a574', '#f4a261', '#000', '#000', '#f4a261', 0],
            [0, 0, '#ffdbac', '#ffdbac', 0, 0, '#d4a574', '#d4a574', 0, 0, '#f4a261', '#f4a261', 0, 0],
            [0, 0, 0, '#e63946', 0, 0, 0, '#4a5759', 0, 0, 0, '#2a9d8f', 0, 0],
            [0, '#e63946', '#e63946', '#e63946', '#e63946', '#4a5759', '#4a5759', '#4a5759', '#4a5759', '#2a9d8f', '#2a9d8f', '#2a9d8f', '#2a9d8f', 0],
            [0, 0, '#e63946', '#e63946', 0, 0, '#4a5759', '#4a5759', 0, 0, '#2a9d8f', '#2a9d8f', 0, 0],
            ['#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513'],
            ['#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410'],
            [0, 0, '#333', 0, 0, 0, '#333', 0, 0, 0, '#333', 0, 0, 0]
        ],
        scale: 4,
        width: 56,
        height: 36
    },
    coffee: {
        // Steaming coffee cup
        pixels: [
            [0, 0, 0, '#ccc', 0, '#ccc', 0, 0, 0, 0],
            [0, 0, '#ccc', 0, '#ccc', 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', 0, '#d2691e', 0],
            [0, '#fff', '#6f4e37', '#6f4e37', '#6f4e37', '#6f4e37', '#fff', '#d2691e', '#d2691e', 0],
            [0, '#fff', '#6f4e37', '#6f4e37', '#6f4e37', '#6f4e37', '#fff', '#d2691e', 0, 0],
            [0, '#fff', '#6f4e37', '#6f4e37', '#6f4e37', '#6f4e37', '#fff', 0, 0, 0],
            [0, '#fff', '#6f4e37', '#6f4e37', '#6f4e37', '#6f4e37', '#fff', 0, 0, 0],
            [0, 0, '#fff', '#fff', '#fff', '#fff', 0, 0, 0, 0],
            [0, 0, '#8b4513', '#8b4513', '#8b4513', '#8b4513', 0, 0, 0, 0]
        ],
        scale: 5,
        width: 50,
        height: 50
    },
    postit: {
        // Post-it with text
        pixels: [
            ['#ffd60a', '#ffd60a', '#ffd60a', '#ffd60a', '#ffd60a', '#ffd60a'],
            ['#ffd60a', '#333', '#333', '#333', '#333', '#ffd60a'],
            ['#ffd60a', '#ffd60a', '#ffd60a', '#ffd60a', '#ffd60a', '#ffd60a'],
            ['#ffd60a', '#333', '#333', '#333', '#ffd60a', '#ffd60a'],
            ['#ffd60a', '#ffd60a', '#ffd60a', '#ffd60a', '#ffd60a', '#ffd60a'],
            ['#ffd60a', '#333', '#333', '#333', '#333', '#ffd60a']
        ],
        scale: 5,
        width: 30,
        height: 30
    }
};

// Draw an obstacle
function drawObstacle(obstacle) {
    const sprite = obstacleSprites[obstacle.type];
    drawPixelArt(obstacle.x, obstacle.y, sprite.pixels, sprite.scale);
}

// Credits
const credits = [
    {
        title: 'MAXIME & HIS DOG',
        description: 'Our brave heroes who face\nthe daily startup challenges',
        sprite: 'player'
    },
    {
        title: 'THE MAN IN SUIT',
        description: 'The mysterious colleague who only talks\nabout synergies and KPIs',
        sprite: 'costume'
    },
    {
        title: 'THE LAPTOP',
        description: 'Symbol of long coding nights\nand impossible deadlines',
        sprite: 'laptop'
    },
    {
        title: 'THE MEETING',
        description: 'Three people who could have\nsent an email',
        sprite: 'meeting'
    },
    {
        title: 'THE COFFEE',
        description: 'Essential fuel to survive\nin the startup jungle',
        sprite: 'coffee'
    },
    {
        title: 'THE POST-IT',
        description: 'TODOs that pile up\nand fly everywhere',
        sprite: 'postit'
    },
    {
        title: '',
        description: 'HAPPY BIRTHDAY MAXIME!\n\n🎂 🎉 🎈',
        sprite: null
    }
];

// Ground and decor
function drawGround() {
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

    // Grass
    ctx.fillStyle = '#95d5b2';
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i + (score % 20), groundY - 5, 10, 5);
    }
}

// Jump
function jump() {
    if (!player.jumping && gameState === 'PLAYING') {
        player.velocityY = -18;
        player.jumping = true;
    }
}

// Update player
function updatePlayer() {
    player.velocityY += gravity;
    player.y += player.velocityY;

    if (player.y >= player.groundY) {
        player.y = player.groundY;
        player.velocityY = 0;
        player.jumping = false;
    }
}

// Create obstacles
function createObstacle() {
    const types = ['costume', 'laptop', 'meeting', 'coffee', 'postit'];
    const type = types[Math.floor(Math.random() * types.length)];
    const sprite = obstacleSprites[type];

    let yPos;
    if (type === 'postit') {
        // Post-its fly in the air
        yPos = groundY - 150 - Math.random() * 50;
    } else if (type === 'laptop') {
        // Laptops on the ground
        yPos = groundY - sprite.pixels.length * sprite.scale;
    } else {
        // Other standing obstacles
        yPos = groundY - sprite.pixels.length * sprite.scale;
    }

    obstacles.push({
        x: canvas.width,
        y: yPos,
        width: sprite.pixels[0].length * sprite.scale,
        height: sprite.pixels.length * sprite.scale,
        type: type
    });
}

// Update obstacles
function updateObstacles() {
    obstacleTimer++;

    // Variable interval for more rhythm
    const currentInterval = 80 + Math.random() * 70;

    if (obstacleTimer > currentInterval) {
        createObstacle();

        // Sometimes create a combo (2 close obstacles)
        if (Math.random() < 0.2) {
            comboTimer = 30; // Create an obstacle in 30 frames
        }

        obstacleTimer = 0;
    }

    // Combo management
    if (comboTimer > 0) {
        comboTimer--;
        if (comboTimer === 0) {
            createObstacle();
        }
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;

            // Progressive speed increase
            if (score % 10 === 0 && gameSpeed < 12) {
                gameSpeed += 0.5;
            }
        }
    });
}

// Collision detection
function checkCollision() {
    return obstacles.some(obstacle => {
        // Reduced tolerance margin for better collisions
        const marginX = 10;
        const marginY = 15;

        return player.x + marginX < obstacle.x + obstacle.width &&
               player.x + player.width - marginX > obstacle.x &&
               player.y + marginY < obstacle.y + obstacle.height &&
               player.y + player.height - marginY > obstacle.y;
    });
}

// Start screen
function drawStartScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 HAPPY BIRTHDAY MAXIME! 🎂', canvas.width / 2, canvas.height / 2 - 50);

    ctx.font = '24px "Courier New"';
    ctx.fillText('Help Maxime and his dog avoid obstacles!', canvas.width / 2, canvas.height / 2 + 20);

    ctx.font = '20px "Courier New"';
    ctx.fillText('Press SPACE or click to start', canvas.width / 2, canvas.height / 2 + 80);
}

// Game over screen
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 50);

    ctx.font = '32px "Courier New"';
    ctx.fillText(`Final score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

    ctx.font = '20px "Courier New"';
    ctx.fillText('Credits in a few seconds...', canvas.width / 2, canvas.height / 2 + 70);

    ctx.font = '16px "Courier New"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('(R to replay now)', canvas.width / 2, canvas.height / 2 + 100);
}

// End credits
function drawCredits() {
    // Black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';

    let yPos = canvas.height - creditsOffset;
    const spacing = 300;

    credits.forEach((credit, index) => {
        const y = yPos + (index * spacing);

        // Only draw if visible on screen
        if (y > -200 && y < canvas.height + 200) {
            // Draw the sprite
            if (credit.sprite === 'player') {
                const maxime = [
                    [0, 0, '#ffdbac', '#ffdbac', '#ffdbac', 0, 0],
                    [0, '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', 0],
                    [0, '#333', '#fff', '#333', '#333', '#fff', 0],
                    [0, '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', 0],
                    [0, 0, '#ff6b6b', '#ff6b6b', '#ff6b6b', 0, 0],
                    [0, '#4dabf7', '#4dabf7', '#4dabf7', '#4dabf7', '#4dabf7', 0],
                    [0, '#4dabf7', '#4dabf7', 0, '#4dabf7', '#4dabf7', 0],
                    [0, '#333', '#333', 0, '#333', '#333', 0]
                ];
                const chien = [
                    [0, '#8b4513', '#8b4513', 0, 0],
                    ['#8b4513', '#8b4513', '#8b4513', '#8b4513', 0],
                    ['#333', '#8b4513', '#8b4513', '#8b4513', '#8b4513'],
                    [0, '#8b4513', '#8b4513', '#8b4513', 0],
                    [0, '#654321', 0, '#654321', 0]
                ];
                drawPixelArt(canvas.width / 2 - 60, y - 100, maxime, 8);
                drawPixelArt(canvas.width / 2 + 20, y - 50, chien, 8);
            } else if (credit.sprite) {
                const sprite = obstacleSprites[credit.sprite];
                const spriteWidth = sprite.pixels[0].length * sprite.scale;
                drawPixelArt(canvas.width / 2 - spriteWidth / 2, y - 80, sprite.pixels, sprite.scale);
            }

            // Title
            ctx.fillStyle = '#ffd60a';
            ctx.font = 'bold 36px "Courier New"';
            ctx.fillText(credit.title, canvas.width / 2, y + 50);

            // Description
            ctx.fillStyle = '#fff';
            ctx.font = '20px "Courier New"';
            const lines = credit.description.split('\n');
            lines.forEach((line, lineIndex) => {
                ctx.fillText(line, canvas.width / 2, y + 90 + (lineIndex * 30));
            });
        }
    });

    // Skip/replay indication
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px "Courier New"';
    if (creditsOffset < (credits.length * spacing) + canvas.height) {
        ctx.fillText('SPACE to skip - R to replay', canvas.width / 2, canvas.height - 20);
    } else {
        ctx.fillText('Press R to replay', canvas.width / 2, canvas.height - 20);
    }

    // Animation
    creditsOffset += 2;

    // End of credits - return to game over
    if (creditsOffset > (credits.length * spacing) + canvas.height + 500) {
        gameState = 'GAME_OVER';
        creditsOffset = 0;
    }
}

// Reset game
function resetGame() {
    score = 0;
    gameSpeed = 6;
    obstacles.length = 0;
    obstacleTimer = 0;
    comboTimer = 0;
    gameOverTimer = 0;
    creditsOffset = 0;
    player.y = player.groundY;
    player.velocityY = 0;
    player.jumping = false;
    gameState = 'PLAYING';
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(1, '#f0e68c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGround();

    if (gameState === 'START') {
        drawPlayer();
        drawStartScreen();
    } else if (gameState === 'PLAYING') {
        updatePlayer();
        updateObstacles();

        // Draw obstacles
        obstacles.forEach(obstacle => {
            drawObstacle(obstacle);
        });

        drawPlayer();

        // Check collisions
        if (checkCollision()) {
            gameState = 'GAME_OVER';
            gameOverTimer = 0;
        }

        // Display score
        document.getElementById('scoreDisplay').textContent = score;
    } else if (gameState === 'GAME_OVER') {
        // Draw obstacles in frozen state
        obstacles.forEach(obstacle => {
            drawObstacle(obstacle);
        });

        drawPlayer();
        drawGameOver();

        // Automatically start credits after 2 seconds
        gameOverTimer++;
        if (gameOverTimer > 120) { // 120 frames = ~2 seconds
            gameState = 'CREDITS';
            creditsOffset = 0;
        }
    } else if (gameState === 'CREDITS') {
        drawCredits();
    }

    requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'START') {
            gameState = 'PLAYING';
        } else if (gameState === 'PLAYING') {
            jump();
        } else if (gameState === 'CREDITS') {
            // Skip the credits
            creditsOffset = (credits.length * 300) + canvas.height + 300;
        }
    }

    // R key to replay directly
    if (e.code === 'KeyR' && (gameState === 'GAME_OVER' || gameState === 'CREDITS')) {
        resetGame();
    }
});

canvas.addEventListener('click', () => {
    if (gameState === 'START') {
        gameState = 'PLAYING';
    } else if (gameState === 'PLAYING') {
        jump();
    } else if (gameState === 'CREDITS') {
        // Skip le générique
        creditsOffset = (credits.length * 300) + canvas.height + 300;
    }
});

// Resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.groundY = canvas.height - 220;
    player.y = player.groundY;
});

// Start game
gameLoop();
