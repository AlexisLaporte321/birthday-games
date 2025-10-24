// Canvas configuration with fixed game area for consistency
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fixed game dimensions (1920x1080 reference)
const GAME_WIDTH = 1920;
const GAME_HEIGHT = 1080;

// Calculate scale to fit screen while maintaining aspect ratio
const scaleX = window.innerWidth / GAME_WIDTH;
const scaleY = window.innerHeight / GAME_HEIGHT;
const scale = Math.min(scaleX, scaleY);

// Set canvas to window size for display
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Calculate offset to center game area
const offsetX = (canvas.width - GAME_WIDTH * scale) / 2;
const offsetY = (canvas.height - GAME_HEIGHT * scale) / 2;

// Game variables
let gameState = 'START'; // START, PLAYING, GAME_OVER, CREDITS
let score = 0;
let collectiblesCollected = 0;
let leaderboard = [];
let gameSpeed = 6;
let gravity = 0.8;
let creditsOffset = 0;
let gameOverTimer = 0;
let recordSubmitted = false;
let animationFrame = 0;

// Delta time for consistent speed across devices
let lastFrameTime = 0;
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;

// Fetch leaderboard on load
fetch('/api/highscore')
    .then(res => res.json())
    .then(data => {
        leaderboard = data.leaderboard || [];
    })
    .catch(err => console.error('Failed to fetch leaderboard:', err));

// Character (Maxime + his dog) - using game coordinates
const player = {
    x: 100,
    y: GAME_HEIGHT - 170,
    width: 78,  // Actual width of Maxime (36px) + gap + dog (32.5px)
    height: 117,  // Full height of Maxime sprite (39 rows * 3 scale)
    velocityY: 0,
    jumping: false,
    groundY: GAME_HEIGHT - 170,
    jumpCount: 0,
    maxJumps: 3  // Triple jump!
};

// Obstacles
const obstacles = [];
const obstacleWidth = 40;
const obstacleHeight = 60;
let obstacleTimer = 0;
const obstacleInterval = 120;
let comboTimer = 0;

// Collectibles (birthday items)
const collectibles = [];


// Obstacle patterns
let patternTimer = 0;
let currentPattern = null;
let lastPatternType = null;

// Background animated elements
const pigeons = [];
const pedestrians = [];
let pigeonSpawnTimer = 0;
let pedestrianSpawnTimer = 0;

// Ground - using game coordinates
const groundY = GAME_HEIGHT - 80;

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

// Collectible sprites (birthday theme)
const collectibleSprites = {
    balloon: {
        // Birthday balloon
        pixels: [
            [0, 0, '#ff69b4', '#ff69b4', '#ff69b4', 0, 0],
            [0, '#ff69b4', '#ff1493', '#ff1493', '#ff1493', '#ff69b4', 0],
            ['#ff69b4', '#ff1493', '#ff1493', '#ff1493', '#ff1493', '#ff1493', '#ff69b4'],
            ['#ff69b4', '#ff1493', '#ff1493', '#ff1493', '#ff1493', '#ff1493', '#ff69b4'],
            ['#ff69b4', '#ff1493', '#ff1493', '#ff1493', '#ff1493', '#ff1493', '#ff69b4'],
            [0, '#ff69b4', '#ff1493', '#ff1493', '#ff1493', '#ff69b4', 0],
            [0, 0, '#ff69b4', '#ff69b4', '#ff69b4', 0, 0],
            [0, 0, 0, '#333', 0, 0, 0],
            [0, 0, 0, '#333', 0, 0, 0],
            [0, 0, 0, '#333', 0, 0, 0]
        ],
        scale: 3
    },
    cake: {
        // Birthday cake slice
        pixels: [
            [0, 0, 0, '#ff6347', 0, 0, 0],
            [0, 0, '#ff6347', '#ffd700', '#ff6347', 0, 0],
            [0, '#ffb6c1', '#ffb6c1', '#ffb6c1', '#ffb6c1', '#ffb6c1', 0],
            [0, '#fff', '#ffb6c1', '#ffb6c1', '#ffb6c1', '#fff', 0],
            ['#f4a460', '#fff', '#ffb6c1', '#ffb6c1', '#ffb6c1', '#fff', '#f4a460'],
            ['#f4a460', '#f4a460', '#f4a460', '#f4a460', '#f4a460', '#f4a460', '#f4a460'],
            ['#daa520', '#daa520', '#daa520', '#daa520', '#daa520', '#daa520', '#daa520']
        ],
        scale: 3.5
    },
    gift: {
        // Gift box
        pixels: [
            [0, 0, '#ffd700', '#ffd700', '#ffd700', 0, 0],
            [0, 0, '#ffd700', '#ffd700', '#ffd700', 0, 0],
            ['#ff4500', '#ff4500', '#ff4500', '#ff4500', '#ff4500', '#ff4500', '#ff4500'],
            ['#ff4500', '#ffa500', '#ffa500', '#ffa500', '#ffa500', '#ffa500', '#ff4500'],
            ['#ff4500', '#ffa500', '#ff4500', '#ff4500', '#ff4500', '#ffa500', '#ff4500'],
            ['#ff4500', '#ffa500', '#ffa500', '#ffa500', '#ffa500', '#ffa500', '#ff4500'],
            ['#ff4500', '#ff4500', '#ff4500', '#ff4500', '#ff4500', '#ff4500', '#ff4500']
        ],
        scale: 3.5
    }
};

// Draw an obstacle
function drawObstacle(obstacle) {
    const sprite = obstacleSprites[obstacle.type];
    drawPixelArt(obstacle.x, obstacle.y, sprite.pixels, sprite.scale);
}

// Draw a collectible with animations
function drawCollectible(collectible) {
    const sprite = collectibleSprites[collectible.type];

    // Check if sprite exists
    if (!sprite) {
        return;
    }

    // Pulse animation - scale oscillation
    const pulseScale = 0.95 + Math.sin(animationFrame * 0.1) * 0.1;
    const animatedScale = sprite.scale * pulseScale;

    // Different animations per type
    let offsetX = 0;
    let offsetY = 0;

    if (collectible.type === 'balloon') {
        // Floating motion for balloon
        offsetY = Math.sin(animationFrame * 0.08) * 3;
        // Slight rotation would need canvas rotation, skip for simplicity
    } else if (collectible.type === 'cake') {
        // Gentle bounce
        offsetY = Math.abs(Math.sin(animationFrame * 0.12)) * 2;
    } else if (collectible.type === 'gift') {
        // Subtle wiggle
        offsetX = Math.sin(animationFrame * 0.15) * 1.5;
    }

    // Draw sparkles around collectibles (more visible)
    const sparkleCount = 4;
    const sparkleRadius = 20;
    for (let i = 0; i < sparkleCount; i++) {
        const angle = (animationFrame * 0.05 + (i * Math.PI * 2 / sparkleCount));
        const sparkleX = collectible.x + collectible.width / 2 + Math.cos(angle) * sparkleRadius;
        const sparkleY = collectible.y + collectible.height / 2 + Math.sin(angle) * sparkleRadius;
        const sparkleAlpha = 0.5 + Math.sin(animationFrame * 0.1 + i) * 0.4;

        // Larger, brighter sparkles
        ctx.fillStyle = `rgba(255, 215, 0, ${sparkleAlpha})`;
        ctx.fillRect(sparkleX - 1.5, sparkleY - 1.5, 3, 3);
    }

    drawPixelArt(collectible.x + offsetX, collectible.y + offsetY, sprite.pixels, animatedScale);
}

// Credits
const credits = [
    {
        title: 'MAXIME & HIS DOG',
        description: 'Our brave heroes who face\nthe daily startup challenges',
        sprite: 'player'
    },
    {
        title: 'BIRTHDAY BALLOON',
        description: 'Floating high in the Paris sky\nWorth +5 points',
        sprite: 'balloon'
    },
    {
        title: 'BIRTHDAY CAKE',
        description: 'Sweet celebration treat\nWorth +5 points',
        sprite: 'cake'
    },
    {
        title: 'BIRTHDAY GIFT',
        description: 'Mystery box of joy\nWorth +5 points',
        sprite: 'gift'
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
    ctx.fillRect(0, groundY, GAME_WIDTH, GAME_HEIGHT - groundY);

    // Grass
    ctx.fillStyle = '#95d5b2';
    for (let i = 0; i < GAME_WIDTH; i += 20) {
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
function updatePlayer(deltaMultiplier = 1) {
    player.velocityY += gravity * deltaMultiplier;
    player.y += player.velocityY * deltaMultiplier;

    if (player.y >= player.groundY) {
        player.y = player.groundY;
        player.velocityY = 0;
        player.jumping = false;
        player.jumpCount = 0;
    }
}

// Create obstacle pattern (wave, tunnel, staircase)
function createPattern(patternType) {
    if (patternType === 'wave') {
        // 3 obstacles at different heights (low, medium, high)
        const types = ['laptop', 'coffee', 'postit'];
        types.forEach((type, index) => {
            const sprite = obstacleSprites[type];
            let yPos;
            if (index === 0) yPos = groundY - sprite.pixels.length * sprite.scale; // Low
            else if (index === 1) yPos = groundY - 120; // Medium
            else yPos = groundY - 180; // High

            obstacles.push({
                x: GAME_WIDTH + index * 70,
                y: yPos,
                width: sprite.pixels[0].length * sprite.scale,
                height: sprite.pixels.length * sprite.scale,
                type: type
            });
        });
    } else if (patternType === 'tunnel') {
        // High and low obstacles - adjusted gap for passability
        const topType = 'postit';
        const bottomType = 'laptop';

        const topSprite = obstacleSprites[topType];
        // Lower the top obstacle to create bigger gap
        obstacles.push({
            x: GAME_WIDTH,
            y: groundY - 160,  // Was -200, now -160 for larger gap
            width: topSprite.pixels[0].length * topSprite.scale,
            height: topSprite.pixels.length * topSprite.scale,
            type: topType
        });

        const bottomSprite = obstacleSprites[bottomType];
        obstacles.push({
            x: GAME_WIDTH,
            y: groundY - bottomSprite.pixels.length * bottomSprite.scale,
            width: bottomSprite.pixels[0].length * bottomSprite.scale,
            height: bottomSprite.pixels.length * bottomSprite.scale,
            type: bottomType
        });
    } else if (patternType === 'staircase') {
        // Ascending/descending stairs pattern - with better spacing
        const types = ['coffee', 'meeting', 'costume'];
        const ascending = Math.random() > 0.5;
        types.forEach((type, index) => {
            const sprite = obstacleSprites[type];
            const heightMultiplier = ascending ? index : (types.length - 1 - index);
            const yPos = groundY - sprite.pixels.length * sprite.scale - (heightMultiplier * 35);

            obstacles.push({
                x: GAME_WIDTH + index * 70,  // Was 50, now 70 for more spacing
                y: yPos,
                width: sprite.pixels[0].length * sprite.scale,
                height: sprite.pixels.length * sprite.scale,
                type: type
            });
        });
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
        x: GAME_WIDTH,
        y: yPos,
        width: sprite.pixels[0].length * sprite.scale,
        height: sprite.pixels.length * sprite.scale,
        type: type
    });
}

// Create collectible (birthday items)
function createCollectible() {
    const types = ['balloon', 'cake', 'gift'];
    const type = types[Math.floor(Math.random() * types.length)];
    const sprite = collectibleSprites[type];

    // Check if sprite exists
    if (!sprite) {
        return;
    }

    // Complex patterns - different heights for challenge
    let yPos;
    const heightPattern = Math.random();

    if (type === 'balloon') {
        // Balloons always high - requires double jump
        yPos = groundY - 220 - Math.random() * 30;
    } else if (heightPattern < 0.3) {
        // Low placement (1 jump)
        yPos = groundY - 100 - Math.random() * 20;
    } else if (heightPattern < 0.6) {
        // Medium placement (1-2 jumps depending on timing)
        yPos = groundY - 150 - Math.random() * 30;
    } else {
        // High placement (double jump)
        yPos = groundY - 200 - Math.random() * 30;
    }

    // Calculate correct dimensions for each type
    let width, height;
    if (type === 'balloon') {
        width = 7 * 3;   // 7 pixels wide * scale 3
        height = 10 * 3;  // 10 pixels tall * scale 3
    } else if (type === 'cake') {
        width = 7 * 3.5;  // 7 pixels wide * scale 3.5
        height = 7 * 3.5; // 7 pixels tall * scale 3.5
    } else if (type === 'gift') {
        width = 7 * 3.5;  // 7 pixels wide * scale 3.5
        height = 7 * 3.5; // 7 pixels tall * scale 3.5
    }

    collectibles.push({
        x: GAME_WIDTH,
        y: yPos,
        width: width,
        height: height,
        type: type
    });

}

// Update obstacles
function updateObstacles(deltaMultiplier = 1) {
    obstacleTimer++;

    // Variable interval for more rhythm
    const currentInterval = 80 + Math.random() * 70;

    if (obstacleTimer > currentInterval) {
        // Decide whether to use a pattern or single obstacle
        const rand = Math.random();

        if (rand < 0.5) {
            // 50% single obstacle (standard)
            createObstacle();
        } else if (rand < 0.85) {
            // 35% wave or staircase (more fun, less hard)
            const patternType = Math.random() < 0.5 ? 'wave' : 'staircase';
            lastPatternType = patternType;
            createPattern(patternType);
        } else {
            // 15% tunnel (challenging)
            lastPatternType = 'tunnel';
            createPattern('tunnel');
        }

        // Create collectible after obstacle with 40% chance
        if (Math.random() < 0.4) {
            setTimeout(() => {
                if (gameState === 'PLAYING') {
                    createCollectible();
                }
            }, 500 + Math.random() * 1000); // Delay 0.5-1.5 seconds
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
        obstacle.x -= gameSpeed * deltaMultiplier;

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;

            // Progressive speed increase after score 10
            if (score > 10 && score % 5 === 0) {
                gameSpeed += 0.3;
            }
        }
    });
}

// Update collectibles
function updateCollectibles(deltaMultiplier = 1) {
    collectibles.forEach((collectible, index) => {
        collectible.x -= gameSpeed * deltaMultiplier;

        // Remove if off screen (no score increase)
        if (collectible.x + collectible.width < 0) {
            collectibles.splice(index, 1);
        }
    });
}

// Collision detection
function checkCollision() {
    return obstacles.some(obstacle => {
        // Reduced tolerance margin for better collisions
        const marginX = 10;
        const marginY = 15;
        const playerTop = player.y - 10;  // Hitbox starts at hat

        return player.x + marginX < obstacle.x + obstacle.width &&
               player.x + player.width - marginX > obstacle.x &&
               playerTop + marginY < obstacle.y + obstacle.height &&
               playerTop + player.height - marginY > obstacle.y;
    });
}

// Collectible collection detection
function checkCollectibleCollection() {
    collectibles.forEach((collectible, index) => {
        // More permissive collision for collectibles
        const marginX = 5;
        const marginY = 5;
        const playerTop = player.y - 10;  // Hitbox starts at hat

        if (player.x + marginX < collectible.x + collectible.width &&
            player.x + player.width - marginX > collectible.x &&
            playerTop + marginY < collectible.y + collectible.height &&
            playerTop + player.height - marginY > collectible.y) {

            // Collect the item
            collectibles.splice(index, 1);
            score += 5; // +5 bonus to score
            collectiblesCollected++;
        }
    });
}

// Start screen
function drawStartScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 HAPPY BIRTHDAY MAXIME! 🎂', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80);

    ctx.font = '24px "Courier New"';
    ctx.fillText('Help Maxime and his dog avoid obstacles in Paris!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10);

    ctx.font = '20px "Courier New"';
    ctx.fillText('Tap to jump (double jump enabled!)', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40);

    if (leaderboard.length > 0) {
        ctx.fillStyle = '#ffd700';
        ctx.font = '22px "Courier New"';
        const topScore = leaderboard[0];
        const recordText = topScore.name ?
            `🌍 World Record: ${topScore.score} (${topScore.name})` :
            `🌍 World Record: ${topScore.score}`;
        ctx.fillText(recordText, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 90);
    }

    ctx.fillStyle = '#fff';
    ctx.font = '18px "Courier New"';
    ctx.fillText('Tap to start', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 130);
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
    const topScore = leaderboard.length > 0 ? leaderboard[0].score : 0;

    // Submit score to API if it's a potential top 3 score (only once)
    if (score > 0 && !recordSubmitted && (leaderboard.length < 3 || score > leaderboard[leaderboard.length - 1].score)) {
        recordSubmitted = true;

        showNameInput().then(playerName => {
            fetch('/api/highscore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score, name: playerName })
            })
            .then(res => res.json())
            .then(data => {
                leaderboard = data.leaderboard || [];
            })
            .catch(err => console.error('Failed to submit score:', err));
        });
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80);

    ctx.font = '32px "Courier New"';
    ctx.fillText(`Score: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10);

    // Show new world record or current world record
    if (score >= topScore && score > 0) {
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 28px "Courier New"';
        ctx.fillText('🌍 NEW WORLD RECORD! 🌍', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30);
    } else if (topScore > 0) {
        ctx.fillStyle = '#fff';
        ctx.font = '24px "Courier New"';
        const topEntry = leaderboard[0];
        const recordText = topEntry.name ?
            `World Record: ${topEntry.score} (${topEntry.name})` :
            `World Record: ${topEntry.score}`;
        ctx.fillText(recordText, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30);
    }

    ctx.fillStyle = '#fff';
    ctx.font = '20px "Courier New"';
    ctx.fillText('Credits in a few seconds...', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80);

    ctx.font = '16px "Courier New"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('(Click/Tap to replay or press R)', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 110);
}

// End credits
function drawCredits(deltaMultiplier = 1) {
    // Black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.textAlign = 'center';

    let yPos = GAME_HEIGHT - creditsOffset;
    const spacing = 300;

    credits.forEach((credit, index) => {
        const y = yPos + (index * spacing);

        // Only draw if visible on screen
        if (y > -200 && y < GAME_HEIGHT + 200) {
            // Draw the sprite
            if (credit.sprite === 'player') {
                // Save player position and restore after
                const savedX = player.x;
                const savedY = player.y;
                player.x = GAME_WIDTH / 2 - 60;
                player.y = y - 50;
                drawPlayer();
                player.x = savedX;
                player.y = savedY;
            } else if (credit.sprite === 'balloon' || credit.sprite === 'cake' || credit.sprite === 'gift') {
                // Draw collectibles
                const sprite = collectibleSprites[credit.sprite];
                if (sprite) {
                    const scale = sprite.scale * 2; // Make them bigger in credits
                    const spriteWidth = sprite.pixels[0].length * scale;
                    drawPixelArt(GAME_WIDTH / 2 - spriteWidth / 2, y - 80, sprite.pixels, scale);
                }
            } else if (credit.sprite && obstacleSprites[credit.sprite]) {
                // Draw obstacles
                const sprite = obstacleSprites[credit.sprite];
                const scale = sprite.scale * 1.5; // Make them a bit bigger
                const spriteWidth = sprite.pixels[0].length * scale;
                drawPixelArt(GAME_WIDTH / 2 - spriteWidth / 2, y - 80, sprite.pixels, scale);
            }

            // Title
            ctx.fillStyle = '#ffd60a';
            ctx.font = 'bold 36px "Courier New"';
            ctx.fillText(credit.title, GAME_WIDTH / 2, y + 50);

            // Description
            ctx.fillStyle = '#fff';
            ctx.font = '20px "Courier New"';
            const lines = credit.description.split('\n');
            lines.forEach((line, lineIndex) => {
                ctx.fillText(line, GAME_WIDTH / 2, y + 90 + (lineIndex * 30));
            });
        }
    });

    // Skip/replay indication
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px "Courier New"';
    if (creditsOffset < (credits.length * spacing) + GAME_HEIGHT) {
        ctx.fillText('Click/Tap to skip', GAME_WIDTH / 2, GAME_HEIGHT - 20);
    } else {
        ctx.fillText('Click/Tap to replay (or press R)', GAME_WIDTH / 2, GAME_HEIGHT - 20);
    }

    // Animation
    creditsOffset += 2 * deltaMultiplier;

    // End of credits - return to game over
    if (creditsOffset > (credits.length * spacing) + GAME_HEIGHT + 500) {
        gameState = 'GAME_OVER';
        creditsOffset = 0;
    }
}

// Reset game
function resetGame() {
    score = 0;
    collectiblesCollected = 0;
    gameSpeed = 6;
    obstacles.length = 0;
    obstacleTimer = 0;
    comboTimer = 0;
    collectibles.length = 0;
    pigeons.length = 0;
    pigeonSpawnTimer = 0;
    pedestrians.length = 0;
    pedestrianSpawnTimer = 0;
    lastPatternType = null;
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
function drawStreetBackground(deltaMultiplier = 1) {
    // Parisian gray sky (very dull, monochrome)
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT * 0.5);
    gradient.addColorStop(0, '#b8b8b8');
    gradient.addColorStop(0.5, '#c8c8c8');
    gradient.addColorStop(1, '#d0d0d0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT * 0.5);

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
    for (let i = -1; i < GAME_WIDTH / 200 + 2; i++) {
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
    for (let i = -1; i < GAME_WIDTH / 160 + 2; i++) {
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
    for (let i = 0; i < GAME_WIDTH / 250 + 2; i++) {
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
    ctx.fillRect(0, groundY - 20, GAME_WIDTH, 20);

    // Pavé pattern
    ctx.fillStyle = '#888888';
    const cobbleOffset = (score * 4) % 20;
    for (let i = 0; i < GAME_WIDTH / 10 + 1; i++) {
        const x = i * 10 - cobbleOffset;
        for (let j = 0; j < 2; j++) {
            ctx.fillRect(x + (j % 2) * 5, groundY - 20 + j * 10, 4, 9);
        }
    }

    // Update and draw pigeons (more frequent and bigger)
    if (gameState === 'PLAYING') {
        pigeonSpawnTimer++;
        if (pigeonSpawnTimer > 150 + Math.random() * 100) {  // More frequent
            pigeons.push({
                x: -30,
                y: groundY - 250 - Math.random() * 250,
                velocityX: 3 + Math.random() * 2,
                velocityY: (Math.random() - 0.5) * 0.8,
                frame: 0,
                size: 2 + Math.random()  // Variable sizes
            });
            pigeonSpawnTimer = 0;
        }
    }

    pigeons.forEach((pigeon, index) => {
        pigeon.x += pigeon.velocityX * deltaMultiplier;
        pigeon.y += pigeon.velocityY * deltaMultiplier;
        pigeon.frame++;

        // Bigger pigeon sprite
        const wingUp = Math.floor(pigeon.frame / 8) % 2 === 0;
        const s = pigeon.size || 2;  // Size multiplier
        ctx.fillStyle = '#404040';
        // Body
        ctx.fillRect(pigeon.x + s, pigeon.y, s * 2, s);
        // Head
        ctx.fillRect(pigeon.x + s * 2, pigeon.y - s/2, s, s);
        // Wings
        if (wingUp) {
            ctx.fillRect(pigeon.x, pigeon.y - s, s * 4, s);
        } else {
            ctx.fillRect(pigeon.x, pigeon.y, s * 4, s);
        }
        // Tail
        ctx.fillRect(pigeon.x, pigeon.y + s/2, s, s/2);

        if (pigeon.x > GAME_WIDTH + 50) {
            pigeons.splice(index, 1);
        }
    });

    // Update and draw pedestrians (more frequent and bigger)
    if (gameState === 'PLAYING') {
        pedestrianSpawnTimer++;
        if (pedestrianSpawnTimer > 100 + Math.random() * 80) {  // More frequent
            pedestrians.push({
                x: GAME_WIDTH + 20,
                y: groundY - 50,
                speed: 0.8 + Math.random() * 0.8,
                frame: 0,
                color: Math.random() > 0.5 ? '#404040' : '#505050',
                size: 2 + Math.random() * 0.5,  // Variable sizes
                type: Math.random() > 0.7 ? 'jogger' : 'walker'
            });
            pedestrianSpawnTimer = 0;
        }
    }

    pedestrians.forEach((ped, index) => {
        ped.x -= ped.speed * deltaMultiplier;
        ped.frame++;

        // Bigger pedestrian sprites
        const legFrame = Math.floor(ped.frame / 12) % 2;
        const s = ped.size || 2;  // Size multiplier
        ctx.fillStyle = ped.color;

        if (ped.type === 'jogger') {
            // Jogger with more animated pose
            // Head
            ctx.fillRect(ped.x + s * 2, ped.y, s * 2, s * 2);
            // Body (leaning forward)
            ctx.fillRect(ped.x + s * 1.5, ped.y + s * 2, s * 3, s * 4);
            // Arms (swinging)
            if (legFrame === 0) {
                ctx.fillRect(ped.x + s * 0.5, ped.y + s * 2, s, s * 3);
                ctx.fillRect(ped.x + s * 4.5, ped.y + s * 3, s, s * 2);
            } else {
                ctx.fillRect(ped.x + s * 4.5, ped.y + s * 2, s, s * 3);
                ctx.fillRect(ped.x + s * 0.5, ped.y + s * 3, s, s * 2);
            }
            // Legs (running)
            if (legFrame === 0) {
                ctx.fillRect(ped.x + s, ped.y + s * 6, s * 1.5, s * 4);
                ctx.fillRect(ped.x + s * 3.5, ped.y + s * 6, s * 1.5, s * 3);
            } else {
                ctx.fillRect(ped.x + s * 3.5, ped.y + s * 6, s * 1.5, s * 4);
                ctx.fillRect(ped.x + s, ped.y + s * 6, s * 1.5, s * 3);
            }
        } else {
            // Walker with casual pose
            // Head
            ctx.fillRect(ped.x + s * 1.5, ped.y, s * 2, s * 2);
            // Body
            ctx.fillRect(ped.x + s * 1.5, ped.y + s * 2, s * 2, s * 4);
            // Arms
            ctx.fillRect(ped.x + s * 0.5, ped.y + s * 2.5, s, s * 3);
            ctx.fillRect(ped.x + s * 3.5, ped.y + s * 2.5, s, s * 3);
            // Legs (walking)
            if (legFrame === 0) {
                ctx.fillRect(ped.x + s, ped.y + s * 6, s * 1.5, s * 4);
                ctx.fillRect(ped.x + s * 2.5, ped.y + s * 6, s * 1.5, s * 4);
            } else {
                ctx.fillRect(ped.x + s * 1.5, ped.y + s * 6, s * 1.5, s * 4);
                ctx.fillRect(ped.x + s * 2, ped.y + s * 6, s * 1.5, s * 4);
            }
        }

        if (ped.x < -30) {
            pedestrians.splice(index, 1);
        }
    });
}

// Main game loop
function gameLoop(currentTime) {
    // Calculate delta time for consistent speed
    if (!lastFrameTime) lastFrameTime = currentTime;
    const deltaTime = Math.min(currentTime - lastFrameTime, 100); // Cap at 100ms to prevent jumps
    const deltaMultiplier = deltaTime / FRAME_TIME;
    lastFrameTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply scaling transformation for consistent game coordinates
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Street background
    drawStreetBackground(deltaMultiplier);
    drawGround();

    if (gameState === 'START') {
        drawPlayer();
        drawStartScreen();
    } else if (gameState === 'PLAYING') {
        updatePlayer(deltaMultiplier);
        updateObstacles(deltaMultiplier);
        updateCollectibles(deltaMultiplier);
        animationFrame++;

        // Draw obstacles
        obstacles.forEach(obstacle => {
            drawObstacle(obstacle);
        });

        drawPlayer();

        // Draw collectibles AFTER player so they're always visible
        collectibles.forEach(collectible => {
            drawCollectible(collectible);
        });


        // Check collisions
        if (checkCollision()) {
            gameState = 'GAME_OVER';
            gameOverTimer = 0;
        }

        // Check collectible collection
        checkCollectibleCollection();

        // Display score
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px "Courier New"';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, 20, 40);

        // Double jump indicator
        ctx.fillStyle = player.jumpCount === 0 ? '#4dabf7' : (player.jumpCount === 1 ? '#ffa500' : '#ff6b6b');
        ctx.fillText(`Jumps: ${'●'.repeat(player.maxJumps - player.jumpCount)}${'○'.repeat(player.jumpCount)}`, 20, 70);

        // Collectibles counter
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 20px "Courier New"';
        ctx.fillText(`🎁 Bonus: ${collectiblesCollected}`, 20, 100);

        // Leaderboard in top right corner
        if (leaderboard.length > 0) {
            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(GAME_WIDTH - 280, 10, 270, 30 + leaderboard.length * 30);

            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 20px "Courier New"';
            ctx.fillText('🏆 TOP 3', GAME_WIDTH - 20, 35);

            leaderboard.forEach((entry, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                const color = index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32';
                ctx.fillStyle = color;
                ctx.font = '18px "Courier New"';
                const text = `${medal} ${entry.score} - ${entry.name}`;
                ctx.fillText(text, GAME_WIDTH - 20, 65 + index * 30);
            });

            ctx.textAlign = 'left';
        }
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
        drawCredits(deltaMultiplier);
    }

    // Restore transformation
    ctx.restore();

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

// Touch and click events
function handleTap() {
    if (gameState === 'START') {
        gameState = 'PLAYING';
    } else if (gameState === 'PLAYING') {
        jump();
    } else if (gameState === 'GAME_OVER') {
        resetGame();
    } else if (gameState === 'CREDITS') {
        creditsOffset = (credits.length * 300) + canvas.height + 300;
    }
}

canvas.addEventListener('click', handleTap);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleTap();
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
