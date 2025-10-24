// Canvas configuration
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let gameState = 'START'; // START, PLAYING, GAME_OVER, CREDITS
let score = 0;
let worldRecord = { score: 0, name: '' };
let gameSpeed = 6;
let gravity = 0.8;
let creditsOffset = 0;
let gameOverTimer = 0;
let recordSubmitted = false;
let animationFrame = 0;

// Fetch world record on load
fetch('/api/highscore')
    .then(res => res.json())
    .then(data => {
        worldRecord = data.worldRecord;
    })
    .catch(err => console.error('Failed to fetch world record:', err));

// Character (Maxime + his dog)
const player = {
    x: 100,
    y: canvas.height - 170,
    width: 100,
    height: 120,
    velocityY: 0,
    jumping: false,
    groundY: canvas.height - 170,
    jumpCount: 0,
    maxJumps: 2
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
    // Animation: alternate leg positions for running
    const runCycle = Math.floor(animationFrame / 10) % 2;

    // Upper body (static)
    const maximeUpper = [
        // Hair (châtain clair/light brown)
        [0, 0, 0, 0, '#b8956a', '#c9a876', '#c9a876', '#c9a876', '#b8956a', 0, 0, 0],
        [0, 0, 0, '#b8956a', '#d4b896', '#d4b896', '#d4b896', '#d4b896', '#d4b896', '#b8956a', 0, 0],
        [0, 0, '#b8956a', '#d4b896', '#d4b896', '#d4b896', '#d4b896', '#d4b896', '#d4b896', '#d4b896', '#b8956a', 0],
        // Head (smaller for tall/slim look)
        [0, 0, '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', 0],
        [0, '#ffdbac', '#ffdbac', '#333', '#fff', '#333', '#ffdbac', '#333', '#fff', '#333', '#ffdbac', '#ffdbac'],
        [0, '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffc0cb', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac'],
        [0, 0, '#ffdbac', '#ffdbac', '#ffdbac', '#ff9999', '#ff9999', '#ff9999', '#ffdbac', '#ffdbac', '#ffdbac', 0],
        // Neck (extra long)
        [0, 0, 0, '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', 0, 0, 0],
        [0, 0, 0, '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', 0, 0, 0],
        [0, 0, 0, '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', 0, 0, 0],
        // Athletic T-shirt (very slim fit)
        [0, 0, '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', 0, 0],
        [0, '#ffdbac', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ffdbac', 0],
        [0, '#ffdbac', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ffdbac', 0],
        ['#ffdbac', '#ffdbac', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ffdbac', '#ffdbac'],
        ['#ffdbac', 0, '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', 0, '#ffdbac'],
        // Torso (longer for tall look)
        [0, 0, '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', 0, 0],
        [0, 0, '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', 0, 0],
        [0, 0, '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', 0, 0],
        // Pants upper (very slim fit)
        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0]
    ];

    // Legs animation - frame 0
    const maximeLower0 = [
        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
        // Running shoes
        [0, 0, '#e74c3c', '#e74c3c', '#e74c3c', 0, 0, '#e74c3c', '#e74c3c', '#e74c3c', 0, 0],
        [0, '#e74c3c', '#e74c3c', '#fff', '#e74c3c', '#e74c3c', '#e74c3c', '#e74c3c', '#fff', '#e74c3c', '#e74c3c', 0],
        [0, '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', 0]
    ];

    // Legs animation - frame 1 (legs switched position)
    const maximeLower1 = [
        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0],
        [0, 0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0],
        [0, 0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
        [0, 0, 0, '#2e3440', '#2e3440', 0, 0, '#2e3440', '#2e3440', 0, 0, 0],
        // Running shoes
        [0, 0, 0, '#e74c3c', '#e74c3c', '#e74c3c', 0, 0, '#e74c3c', '#e74c3c', '#e74c3c', 0],
        [0, 0, '#e74c3c', '#e74c3c', '#fff', '#e74c3c', '#e74c3c', '#e74c3c', '#e74c3c', '#fff', '#e74c3c', '#e74c3c'],
        [0, 0, '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333']
    ];

    const maxime = [...maximeUpper, ...(runCycle === 0 ? maximeLower0 : maximeLower1)];

    // Dog animation
    const dogCycle = Math.floor(animationFrame / 8) % 2;

    // Dog frame 0
    const chien0 = [
        // Border Collie - Ears (pointed up)
        [0, 0, '#333', 0, 0, 0, 0, 0, 0, 0, '#333', 0, 0],
        [0, '#333', '#fff', '#333', 0, 0, 0, 0, 0, '#333', '#fff', '#333', 0],
        [0, '#333', '#fff', '#333', 0, 0, 0, 0, 0, '#333', '#fff', '#333', 0],
        // Head (black and white pattern)
        [0, 0, '#333', '#fff', '#fff', '#333', '#333', '#333', '#fff', '#fff', '#333', 0, 0],
        [0, '#333', '#fff', '#333', '#fff', '#fff', '#333', '#fff', '#fff', '#333', '#fff', '#333', 0],
        [0, '#333', '#fff', '#333', '#333', '#fff', '#fff', '#fff', '#333', '#333', '#fff', '#333', 0],
        [0, '#333', '#fff', '#fff', '#fff', '#fff', '#333', '#fff', '#fff', '#fff', '#fff', '#333', 0],
        [0, 0, '#333', '#fff', '#fff', '#fff', '#ffc0cb', '#fff', '#fff', '#fff', '#333', 0, 0],
        // Neck/Chest (white chest, black back)
        [0, 0, 0, '#333', '#fff', '#fff', '#fff', '#fff', '#fff', '#333', '#333', 0, 0],
        // Body (black with white belly)
        [0, 0, '#333', '#333', '#333', '#fff', '#fff', '#fff', '#333', '#333', '#333', '#333', 0],
        [0, '#333', '#333', '#333', '#333', '#fff', '#fff', '#fff', '#333', '#333', '#333', '#333', '#333'],
        [0, '#333', '#333', '#333', '#333', '#fff', '#fff', '#fff', '#333', '#333', '#333', '#333', '#333'],
        [0, '#333', '#333', '#333', '#333', '#fff', '#fff', '#fff', '#333', '#333', '#333', '#333', 0],
        // Legs (running position 1)
        [0, '#333', '#333', 0, 0, '#fff', '#fff', 0, 0, '#333', '#333', 0, 0],
        [0, '#333', '#333', 0, 0, '#fff', '#fff', 0, 0, '#333', '#333', 0, 0],
        // Paws
        [0, '#fff', '#fff', 0, 0, '#333', '#333', 0, 0, '#fff', '#fff', 0, 0]
    ];

    // Dog frame 1 (legs switched)
    const chien1 = [
        // Border Collie - Ears (pointed up)
        [0, 0, '#333', 0, 0, 0, 0, 0, 0, 0, '#333', 0, 0],
        [0, '#333', '#fff', '#333', 0, 0, 0, 0, 0, '#333', '#fff', '#333', 0],
        [0, '#333', '#fff', '#333', 0, 0, 0, 0, 0, '#333', '#fff', '#333', 0],
        // Head (black and white pattern)
        [0, 0, '#333', '#fff', '#fff', '#333', '#333', '#333', '#fff', '#fff', '#333', 0, 0],
        [0, '#333', '#fff', '#333', '#fff', '#fff', '#333', '#fff', '#fff', '#333', '#fff', '#333', 0],
        [0, '#333', '#fff', '#333', '#333', '#fff', '#fff', '#fff', '#333', '#333', '#fff', '#333', 0],
        [0, '#333', '#fff', '#fff', '#fff', '#fff', '#333', '#fff', '#fff', '#fff', '#fff', '#333', 0],
        [0, 0, '#333', '#fff', '#fff', '#fff', '#ffc0cb', '#fff', '#fff', '#fff', '#333', 0, 0],
        // Neck/Chest (white chest, black back)
        [0, 0, 0, '#333', '#fff', '#fff', '#fff', '#fff', '#fff', '#333', '#333', 0, 0],
        // Body (black with white belly)
        [0, 0, '#333', '#333', '#333', '#fff', '#fff', '#fff', '#333', '#333', '#333', '#333', 0],
        [0, '#333', '#333', '#333', '#333', '#fff', '#fff', '#fff', '#333', '#333', '#333', '#333', '#333'],
        [0, '#333', '#333', '#333', '#333', '#fff', '#fff', '#fff', '#333', '#333', '#333', '#333', '#333'],
        [0, '#333', '#333', '#333', '#333', '#fff', '#fff', '#fff', '#333', '#333', '#333', '#333', 0],
        // Legs (running position 2)
        [0, 0, '#333', '#333', 0, 0, '#fff', '#fff', 0, 0, '#333', '#333', 0],
        [0, 0, '#333', '#333', 0, 0, '#fff', '#fff', 0, 0, '#333', '#333', 0],
        // Paws
        [0, 0, '#fff', '#fff', 0, 0, '#333', '#333', 0, 0, '#fff', '#fff', 0]
    ];

    const chien = dogCycle === 0 ? chien0 : chien1;

    drawPixelArt(player.x, player.y - 10, maxime, 3);
    drawPixelArt(player.x + 45, player.y + 55, chien, 2.5);
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

// Jump (with double jump)
function jump() {
    if (gameState === 'PLAYING' && player.jumpCount < player.maxJumps) {
        player.velocityY = -16;
        player.jumping = true;
        player.jumpCount++;
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
        player.jumpCount = 0;
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
    ctx.fillText('🎉 HAPPY BIRTHDAY MAXIME! 🎂', canvas.width / 2, canvas.height / 2 - 80);

    ctx.font = '24px "Courier New"';
    ctx.fillText('Help Maxime and his dog avoid obstacles in Paris!', canvas.width / 2, canvas.height / 2 - 10);

    ctx.font = '20px "Courier New"';
    ctx.fillText('Press SPACE to jump (double jump enabled!)', canvas.width / 2, canvas.height / 2 + 40);

    if (worldRecord.score > 0) {
        ctx.fillStyle = '#ffd700';
        ctx.font = '22px "Courier New"';
        const recordText = worldRecord.name ?
            `🌍 World Record: ${worldRecord.score} (${worldRecord.name})` :
            `🌍 World Record: ${worldRecord.score}`;
        ctx.fillText(recordText, canvas.width / 2, canvas.height / 2 + 90);
    }

    ctx.fillStyle = '#fff';
    ctx.font = '18px "Courier New"';
    ctx.fillText('Press SPACE or click to start', canvas.width / 2, canvas.height / 2 + 130);
}

// Show custom name input modal
function showNameInput() {
    return new Promise((resolve) => {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            font-family: 'Courier New', monospace;
        `;

        // Create modal box
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            text-align: center;
            max-width: 400px;
        `;

        modal.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">🌍</div>
            <h2 style="color: #ffd700; font-size: 28px; margin-bottom: 10px;">NEW WORLD RECORD!</h2>
            <p style="color: white; margin-bottom: 20px; font-size: 18px;">Congratulations! Enter your name:</p>
            <input type="text" id="playerNameInput" maxlength="20"
                style="width: 100%; padding: 12px; font-size: 18px; border: none; border-radius: 8px;
                       font-family: 'Courier New', monospace; text-align: center; margin-bottom: 20px;"
                placeholder="Your name">
            <button id="submitName"
                style="background: #ffd700; color: #333; border: none; padding: 12px 30px;
                       font-size: 18px; border-radius: 8px; cursor: pointer; font-weight: bold;
                       font-family: 'Courier New', monospace;">
                Submit
            </button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const input = document.getElementById('playerNameInput');
        const button = document.getElementById('submitName');

        input.focus();

        const submit = () => {
            const name = input.value.trim() || 'Anonymous';
            document.body.removeChild(overlay);
            resolve(name);
        };

        button.addEventListener('click', submit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submit();
        });
    });
}

// Game over screen
function drawGameOver() {
    // Submit score to API if it's a new world record (only once)
    if (score > worldRecord.score && score > 0 && !recordSubmitted) {
        recordSubmitted = true;

        showNameInput().then(playerName => {
            fetch('/api/highscore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score, name: playerName })
            })
            .then(res => res.json())
            .then(data => {
                worldRecord = data.worldRecord;
            })
            .catch(err => console.error('Failed to submit score:', err));
        });
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 80);

    ctx.font = '32px "Courier New"';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 10);

    // Show new world record or current world record
    if (score >= worldRecord.score && score > 0) {
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 28px "Courier New"';
        ctx.fillText('🌍 NEW WORLD RECORD! 🌍', canvas.width / 2, canvas.height / 2 + 30);
    } else if (worldRecord.score > 0) {
        ctx.fillStyle = '#fff';
        ctx.font = '24px "Courier New"';
        const recordText = worldRecord.name ?
            `World Record: ${worldRecord.score} (${worldRecord.name})` :
            `World Record: ${worldRecord.score}`;
        ctx.fillText(recordText, canvas.width / 2, canvas.height / 2 + 30);
    }

    ctx.fillStyle = '#fff';
    ctx.font = '20px "Courier New"';
    ctx.fillText('Credits in a few seconds...', canvas.width / 2, canvas.height / 2 + 80);

    ctx.font = '16px "Courier New"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('(R to replay now / SPACE for double jump!)', canvas.width / 2, canvas.height / 2 + 110);
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
    recordSubmitted = false;
    player.y = player.groundY;
    player.velocityY = 0;
    player.jumping = false;
    player.jumpCount = 0;
    gameState = 'PLAYING';
}

// Draw Parisian street background
function drawStreetBackground() {
    // Parisian gray sky (very dull, monochrome)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5);
    gradient.addColorStop(0, '#b8b8b8');
    gradient.addColorStop(0.5, '#c8c8c8');
    gradient.addColorStop(1, '#d0d0d0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);

    // Very subtle clouds
    ctx.fillStyle = 'rgba(160, 160, 160, 0.15)';
    const cloudOffset = (score * 0.1) % 600;
    for (let i = 0; i < 3; i++) {
        const cloudX = i * 300 - cloudOffset;
        ctx.beginPath();
        ctx.arc(cloudX, 80 + i * 30, 40, 0, Math.PI * 2);
        ctx.arc(cloudX + 50, 80 + i * 30, 50, 0, Math.PI * 2);
        ctx.arc(cloudX + 100, 80 + i * 30, 45, 0, Math.PI * 2);
        ctx.fill();
    }

    // Buildings in background (parallax effect)
    const buildingOffset1 = (score * 0.3) % 350;
    const buildingOffset2 = (score * 0.4) % 300;

    // Far Haussmann buildings (light gray stone - pierre de taille)
    ctx.fillStyle = '#d8d8d8';
    for (let i = -1; i < canvas.width / 200 + 2; i++) {
        const x = i * 200 - buildingOffset1;
        const height = 160 + (i % 3) * 15; // 6-7 story uniform Haussmann height
        ctx.fillRect(x, groundY - 220 - height, 180, height);

        // Zinc roof (typical Paris gray roofs)
        ctx.fillStyle = '#909090';
        ctx.fillRect(x, groundY - 220 - height - 12, 180, 12);

        // Chimneys on roof
        ctx.fillStyle = '#808080';
        for (let c = 0; c < 3; c++) {
            ctx.fillRect(x + 40 + c * 50, groundY - 220 - height - 25, 8, 13);
        }

        // Windows (very subtle, aligned)
        ctx.fillStyle = '#a0a0a0';
        const seed = i * 7;
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 5; col++) {
                if ((seed + row * 5 + col) % 13 === 0) {
                    // Tall French windows
                    ctx.fillRect(x + 15 + col * 33, groundY - 220 - height + 15 + row * 25, 16, 22);
                }
            }
        }

        // Subtle balcony railings (fer forgé)
        ctx.strokeStyle = '#b0b0b0';
        ctx.lineWidth = 1;
        for (let row = 2; row < 6; row++) {
            ctx.beginPath();
            ctx.moveTo(x + 10, groundY - 220 - height + 36 + row * 25);
            ctx.lineTo(x + 170, groundY - 220 - height + 36 + row * 25);
            ctx.stroke();
        }

        ctx.fillStyle = '#d8d8d8';
    }

    // Closer Haussmann buildings (medium gray)
    ctx.fillStyle = '#c0c0c0';
    for (let i = -1; i < canvas.width / 160 + 2; i++) {
        const x = i * 160 - buildingOffset2;
        const height = 130 + (i % 3) * 12;
        ctx.fillRect(x, groundY - 150 - height, 145, height);

        // Zinc roof
        ctx.fillStyle = '#787878';
        ctx.fillRect(x, groundY - 150 - height - 10, 145, 10);

        // Chimneys
        ctx.fillStyle = '#707070';
        for (let c = 0; c < 2; c++) {
            ctx.fillRect(x + 35 + c * 60, groundY - 150 - height - 20, 7, 10);
        }

        // Windows (barely visible)
        ctx.fillStyle = '#909090';
        const seed = i * 11;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 4; col++) {
                if ((seed + row * 4 + col) % 11 === 0) {
                    ctx.fillRect(x + 15 + col * 30, groundY - 150 - height + 12 + row * 22, 14, 18);
                }
            }
        }

        // Balconies
        ctx.strokeStyle = '#a0a0a0';
        ctx.lineWidth = 1;
        for (let row = 2; row < 5; row++) {
            ctx.beginPath();
            ctx.moveTo(x + 10, groundY - 150 - height + 30 + row * 22);
            ctx.lineTo(x + 135, groundY - 150 - height + 30 + row * 22);
            ctx.stroke();
        }

        ctx.fillStyle = '#c0c0c0';
    }

    // Parisian street lamps (very subtle)
    const lampOffset = (score * 2) % 250;
    for (let i = 0; i < canvas.width / 250 + 2; i++) {
        const lampX = i * 250 - lampOffset;

        // Base
        ctx.fillStyle = '#606060';
        ctx.fillRect(lampX - 3, groundY - 20, 6, 5);

        // Post
        ctx.strokeStyle = '#707070';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(lampX, groundY - 15);
        ctx.lineTo(lampX, groundY - 85);
        ctx.stroke();

        // Top
        ctx.fillStyle = '#606060';
        ctx.beginPath();
        ctx.arc(lampX, groundY - 87, 4, 0, Math.PI * 2);
        ctx.fill();

        // Lantern
        ctx.fillStyle = '#505050';
        ctx.fillRect(lampX - 7, groundY - 105, 14, 18);

        // Very dim light
        ctx.fillStyle = '#989870';
        ctx.fillRect(lampX - 5, groundY - 103, 10, 14);
    }

    // Parisian sidewalk (pavé)
    ctx.fillStyle = '#9a9a9a';
    ctx.fillRect(0, groundY - 20, canvas.width, 20);

    // Pavé pattern
    ctx.fillStyle = '#888888';
    const cobbleOffset = (score * 4) % 20;
    for (let i = 0; i < canvas.width / 10 + 1; i++) {
        const x = i * 10 - cobbleOffset;
        for (let j = 0; j < 2; j++) {
            ctx.fillRect(x + (j % 2) * 5, groundY - 20 + j * 10, 4, 9);
        }
    }
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Street background
    drawStreetBackground();
    drawGround();

    if (gameState === 'START') {
        drawPlayer();
        drawStartScreen();
    } else if (gameState === 'PLAYING') {
        updatePlayer();
        updateObstacles();
        animationFrame++;

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

        // Display score and world record
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px "Courier New"';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, 20, 40);

        if (worldRecord.score > 0) {
            ctx.fillStyle = score >= worldRecord.score ? '#ffd700' : '#fff';
            const wrText = worldRecord.name ?
                `🌍 WR: ${worldRecord.score} (${worldRecord.name})` :
                `🌍 WR: ${worldRecord.score}`;
            ctx.fillText(wrText, 20, 70);
        }

        // Double jump indicator
        ctx.fillStyle = player.jumpCount === 0 ? '#4dabf7' : (player.jumpCount === 1 ? '#ffa500' : '#ff6b6b');
        ctx.fillText(`Jumps: ${'●'.repeat(player.maxJumps - player.jumpCount)}${'○'.repeat(player.jumpCount)}`, 20, 100);
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
    player.groundY = canvas.height - 170;
    player.y = player.groundY;
});

// Start game
gameLoop();
