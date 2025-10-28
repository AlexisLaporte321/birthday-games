// Katerina's Birthday Game - Complete Bundle
// All game components in a single file without ES6 modules

(function() {
    'use strict';

    // Game configuration with ALL obstacles and collectibles
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
            },
            companion: {
                offsetX: 45,
                offsetY: 55,
                scale: 2.5,
                sprites: [
                    [
                        [0, 0, '#d4a574', 0, 0, 0, 0, 0, '#d4a574', 0, 0],
                        [0, '#d4a574', '#fff', '#d4a574', 0, 0, 0, '#d4a574', '#fff', '#d4a574', 0],
                        [0, 0, '#d4a574', '#fff', '#fff', '#d4a574', '#fff', '#fff', '#d4a574', 0, 0],
                        [0, '#d4a574', '#fff', '#333', '#fff', '#d4a574', '#fff', '#333', '#fff', '#d4a574', 0],
                        [0, '#d4a574', '#fff', '#fff', '#fff', '#ffc0cb', '#fff', '#fff', '#fff', '#d4a574', 0],
                        [0, 0, '#d4a574', '#fff', '#fff', '#fff', '#fff', '#fff', '#d4a574', 0, 0],
                        [0, 0, '#d4a574', '#fff', '#fff', '#fff', '#fff', '#fff', '#d4a574', '#d4a574', 0],
                        [0, '#d4a574', '#d4a574', '#fff', '#fff', '#fff', '#fff', '#d4a574', '#d4a574', '#d4a574', '#d4a574'],
                        [0, '#d4a574', '#d4a574', '#d4a574', '#fff', '#fff', '#fff', '#d4a574', '#d4a574', '#d4a574', 0],
                        [0, '#d4a574', '#d4a574', '#d4a574', '#fff', '#fff', '#fff', '#d4a574', '#d4a574', '#d4a574', 0],
                        [0, '#fff', '#fff', 0, 0, '#fff', '#fff', 0, 0, '#d4a574', '#d4a574', 0],
                        [0, '#fff', '#fff', 0, 0, '#fff', '#fff', 0, 0, '#d4a574', '#d4a574', 0],
                        [0, '#333', '#333', 0, 0, '#333', '#333', 0, 0, '#333', '#333', 0]
                    ],
                    [
                        [0, 0, '#d4a574', 0, 0, 0, 0, 0, '#d4a574', 0, 0],
                        [0, '#d4a574', '#fff', '#d4a574', 0, 0, 0, '#d4a574', '#fff', '#d4a574', 0],
                        [0, 0, '#d4a574', '#fff', '#fff', '#d4a574', '#fff', '#fff', '#d4a574', 0, 0],
                        [0, '#d4a574', '#fff', '#333', '#fff', '#d4a574', '#fff', '#333', '#fff', '#d4a574', 0],
                        [0, '#d4a574', '#fff', '#fff', '#fff', '#ffc0cb', '#fff', '#fff', '#fff', '#d4a574', 0],
                        [0, 0, '#d4a574', '#fff', '#fff', '#fff', '#fff', '#fff', '#d4a574', 0, 0],
                        [0, 0, '#d4a574', '#fff', '#fff', '#fff', '#fff', '#fff', '#d4a574', '#d4a574', 0],
                        [0, '#d4a574', '#d4a574', '#fff', '#fff', '#fff', '#fff', '#d4a574', '#d4a574', '#d4a574', '#d4a574'],
                        [0, '#d4a574', '#d4a574', '#d4a574', '#fff', '#fff', '#fff', '#d4a574', '#d4a574', '#d4a574', 0],
                        [0, '#d4a574', '#d4a574', '#d4a574', '#fff', '#fff', '#fff', '#d4a574', '#d4a574', '#d4a574', 0],
                        [0, 0, '#fff', '#fff', 0, 0, '#fff', '#fff', 0, 0, '#d4a574', '#d4a574'],
                        [0, 0, '#fff', '#fff', 0, 0, '#fff', '#fff', 0, 0, '#d4a574', '#d4a574'],
                        [0, 0, '#333', '#333', 0, 0, '#333', '#333', 0, 0, '#333', '#333']
                    ]
                ]
            }
        },
        obstacles: {
            spawnInterval: 80,
            spawnVariation: 50,
            sprites: {
                column: {
                    pixels: [[0, 0, '#e8e8e8', '#e8e8e8', '#e8e8e8', '#e8e8e8', 0, 0],[0, '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', 0],[0, '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', 0],[0, 0, '#e8e8e8', '#e8e8e8', '#e8e8e8', '#e8e8e8', 0, 0],[0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],[0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],[0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],[0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],[0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],[0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],[0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],[0, 0, '#d3d3d3', '#e8e8e8', '#e8e8e8', '#d3d3d3', 0, 0],[0, 0, '#e8e8e8', '#e8e8e8', '#e8e8e8', '#e8e8e8', 0, 0],[0, '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', 0],[0, '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', 0]],
                    scale: 5, width: 40, height: 75
                },
                roadmap: {
                    pixels: [['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],['#fff', '#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2', '#fff'],['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],['#fff', '#e74c3c', '#e74c3c', '#333', '#333', '#333', '#333', '#fff'],['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],['#fff', '#f39c12', '#f39c12', '#333', '#333', '#333', '#333', '#fff'],['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],['#fff', '#2ecc71', '#2ecc71', '#333', '#333', '#333', '#333', '#fff']],
                    scale: 5, width: 40, height: 40, flying: true
                },
                frappe: {
                    pixels: [[0, 0, '#ccc', 0, '#ccc', 0, 0],[0, 0, 0, '#ccc', 0, 0, 0],[0, 0, 0, '#ff6b6b', 0, 0, 0],[0, '#fff', '#fff', '#d4a574', '#fff', '#fff', 0],[0, '#fff', '#d4a574', '#d4a574', '#d4a574', '#fff', 0],[0, '#fff', '#d4a574', '#d4a574', '#d4a574', '#fff', 0],[0, '#fff', '#d4a574', '#d4a574', '#d4a574', '#fff', 0],[0, '#fff', '#d4a574', '#d4a574', '#d4a574', '#fff', 0],[0, '#fff', '#fff', '#fff', '#fff', '#fff', 0],[0, 0, '#fff', '#fff', '#fff', 0, 0]],
                    scale: 5, width: 35, height: 50
                },
                vespa: {
                    pixels: [[0, 0, 0, '#4a90e2', '#4a90e2', '#4a90e2', 0, 0, 0, 0],[0, 0, '#4a90e2', '#fff', '#fff', '#fff', '#4a90e2', 0, 0, 0],[0, '#4a90e2', '#fff', '#fff', '#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2', 0, 0],['#4a90e2', '#fff', '#fff', '#4a90e2', '#4a90e2', '#333', '#333', '#4a90e2', '#4a90e2', 0],['#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2', '#333', '#333', '#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2'],[0, '#333', '#333', '#333', '#333', '#4a90e2', '#4a90e2', '#333', '#333', '#333'],[0, 0, '#333', '#666', '#333', 0, 0, '#333', '#666', '#333']],
                    scale: 5, width: 50, height: 35
                },
                olive: {
                    pixels: [[0, 0, '#228b22', '#228b22', '#228b22', 0, 0],[0, '#228b22', '#228b22', '#228b22', '#228b22', '#228b22', 0],['#228b22', '#228b22', '#8b4513', '#228b22', '#228b22', '#228b22', '#228b22'],[0, '#228b22', '#8b4513', '#8b4513', '#228b22', '#228b22', 0],[0, 0, '#8b4513', '#8b4513', '#228b22', 0, 0],[0, 0, '#8b4513', '#8b4513', 0, 0, 0],[0, '#a0522d', '#a0522d', '#a0522d', '#a0522d', '#a0522d', 0],[0, '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', 0],[0, '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', 0]],
                    scale: 5, width: 35, height: 45
                },
                meeting: {
                    pixels: [[0, 0, '#ffdbac', '#ffdbac', 0, 0, '#d4a574', '#d4a574', 0, 0, '#f4a261', '#f4a261', 0, 0],[0, '#ffdbac', '#000', '#000', '#ffdbac', '#d4a574', '#000', '#000', '#d4a574', '#f4a261', '#000', '#000', '#f4a261', 0],[0, 0, '#ffdbac', '#ffdbac', 0, 0, '#d4a574', '#d4a574', 0, 0, '#f4a261', '#f4a261', 0, 0],[0, 0, 0, '#e63946', 0, 0, 0, '#4a5759', 0, 0, 0, '#2a9d8f', 0, 0],[0, '#e63946', '#e63946', '#e63946', '#e63946', '#4a5759', '#4a5759', '#4a5759', '#4a5759', '#2a9d8f', '#2a9d8f', '#2a9d8f', '#2a9d8f', 0],[0, 0, '#e63946', '#e63946', 0, 0, '#4a5759', '#4a5759', 0, 0, '#2a9d8f', '#2a9d8f', 0, 0],['#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513'],['#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410', '#6b3410'],[0, 0, '#333', 0, 0, 0, '#333', 0, 0, 0, '#333', 0, 0, 0]],
                    scale: 4, width: 56, height: 36
                }
            }
        },
        collectibles: {
            sprites: {
                eurocoin: {
                    pixels: [[0, '#ffd700', '#ffd700', '#ffd700', 0],['#ffd700', '#fff200', '#fff200', '#fff200', '#ffd700'],['#ffd700', '#fff200', '€', '#fff200', '#ffd700'],['#ffd700', '#fff200', '#fff200', '#fff200', '#ffd700'],[0, '#ffd700', '#ffd700', '#ffd700', 0]],
                    scale: 6, width: 30, height: 30, points: 10
                },
                greekflag: {
                    pixels: [['#4a90e2', '#fff', '#4a90e2'],['#fff', '#4a90e2', '#fff'],['#4a90e2', '#fff', '#4a90e2'],['#fff', '#fff', '#fff'],['#4a90e2', '#4a90e2', '#4a90e2']],
                    scale: 6, width: 18, height: 30, points: 5
                },
                lightbulb: {
                    pixels: [[0, '#fff200', '#fff200', '#fff200', 0],['#fff200', '#fff200', '#fff200', '#fff200', '#fff200'],['#fff200', '#fff200', '#fff200', '#fff200', '#fff200'],['#fff200', '#fff200', '#fff200', '#fff200', '#fff200'],[0, '#fff200', '#fff200', '#fff200', 0],[0, '#666', '#666', '#666', 0],[0, '#666', '#666', '#666', 0]],
                    scale: 5, width: 25, height: 35, points: 15
                }
            }
        },
        credits: [
            {title: 'KATERINA & HER CAT', description: 'Our Venture Designer crafting\\nEkinox innovations for Eurobank', sprite: 'player'},
            {title: 'THE PARTHENON COLUMN', description: 'Ancient wisdom inspiring\\nmodern banking solutions', sprite: 'column'},
            {title: 'THE DESIGN CANVAS', description: 'Strategic visions that pivot faster\\nthan Greek weather', sprite: 'roadmap'},
            {title: 'THE FRAPPÉ', description: 'Essential fuel for design sprints\\nand stakeholder workshops', sprite: 'frappe'},
            {title: 'THE VESPA', description: 'Racing between 321 Studio\\nand Eurobank meetings', sprite: 'vespa'},
            {title: 'THE OLIVE TREE', description: 'Symbol of patience needed\\nfor banking innovation', sprite: 'olive'},
            {title: 'THE STAKEHOLDER MEETING', description: 'Where venture design meets\\nbanking requirements', sprite: 'meeting'},
            {title: '', description: 'HAPPY BIRTHDAY KATERINA!\\n\\n🎂 🇬🇷 🎉', sprite: null}
        ],
        theme: {
            groundColor: '#c9a876',
            groundGrassColor: '#95d5b2',
            textColor: '#fff',
            accentColor: '#ffd700'
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

    console.log('[GAME] Loaded with obstacles:', Object.keys(gameConfig.obstacles.sprites));
    console.log('[GAME] Loaded with collectibles:', Object.keys(gameConfig.collectibles.sprites));

    // Initialize game
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const BASE_SCREEN_WIDTH = 1920;
    const speedMultiplier = canvas.width / BASE_SCREEN_WIDTH;

    let gameState = 'START';
    let score = 0;
    let gameSpeed = gameConfig.difficulty.baseSpeed * speedMultiplier;
    let animationFrame = 0;
    let gameOverTimer = 0;
    let creditsOffset = 0;
    let recordSubmitted = false;

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

    let obstacles = [];
    let obstacleTimer = 0;
    let comboTimer = 0;
    let tripleCombo = false;
    let mixedHeightPattern = false;

    let collectibles = [];
    let collectibleTimer = 0;

    let leaderboard = [];

    const groundY = canvas.height - 80;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Leaderboard functions
    async function fetchLeaderboard() {
        try {
            const res = await fetch('/api/highscore');
            const data = await res.json();
            leaderboard = data.leaderboard || [];
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err);
        }
    }

    async function submitScore(scoreValue, name) {
        try {
            const res = await fetch('/api/highscore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: scoreValue, name })
            });
            const data = await res.json();
            leaderboard = data.leaderboard || [];
            return true;
        } catch (err) {
            console.error('Failed to submit score:', err);
            return false;
        }
    }

    function isTopScore(scoreValue) {
        if (leaderboard.length === 0) return scoreValue > 0;
        return scoreValue > 0 && (leaderboard.length < 3 || scoreValue > leaderboard[leaderboard.length - 1].score);
    }

    function showNameInput() {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; font-family: "Courier New", monospace;';

            const modal = document.createElement('div');
            modal.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); text-align: center; max-width: 400px;';

            modal.innerHTML = '<div style="font-size: 48px; margin-bottom: 20px;">🌍</div><h2 style="color: #ffd700; font-size: 28px; margin-bottom: 10px;">NEW WORLD RECORD!</h2><p style="color: white; margin-bottom: 20px; font-size: 18px;">Congratulations! Enter your name:</p><input type="text" id="playerNameInput" maxlength="20" style="width: 100%; padding: 12px; font-size: 18px; border: none; border-radius: 8px; font-family: \'Courier New\', monospace; text-align: center; margin-bottom: 20px;" placeholder="Your name"><button id="submitName" style="background: #ffd700; color: #333; border: none; padding: 12px 30px; font-size: 18px; border-radius: 8px; cursor: pointer; font-weight: bold; font-family: \'Courier New\', monospace;">Submit</button>';

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

    fetchLeaderboard();

    // Drawing functions
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

    function drawPlayer() {
        const runCycle = Math.floor(animationFrame / 10) % 2;
        const catCycle = Math.floor(animationFrame / 8) % 2;

        const playerSprite = [...gameConfig.player.sprites.upper, ...gameConfig.player.sprites.lower[runCycle]];
        drawPixelArt(player.x, player.y - 10, playerSprite, gameConfig.player.spriteScale || 3);

        if (gameConfig.player.companion) {
            const companionSprite = gameConfig.player.companion.sprites[catCycle];
            drawPixelArt(
                player.x + gameConfig.player.companion.offsetX,
                player.y + gameConfig.player.companion.offsetY,
                companionSprite,
                gameConfig.player.companion.scale || 2.5
            );
        }

        if (isLocalhost) {
            const marginX = 10, marginY = 15;
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(player.x + marginX, player.y + marginY, player.width - marginX * 2, player.height - marginY * 2);
        }
    }

    function drawObstacle(obstacle) {
        const sprite = gameConfig.obstacles.sprites[obstacle.type];
        drawPixelArt(obstacle.x, obstacle.y, sprite.pixels, sprite.scale);

        if (isLocalhost) {
            const marginX = 10, marginY = 15;
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(obstacle.x + marginX, obstacle.y + marginY, obstacle.width - marginX * 2, obstacle.height - marginY * 2);
        }
    }

    function drawCollectible(collectible) {
        const sprite = gameConfig.collectibles.sprites[collectible.type];
        if (!sprite) return;

        const floatOffset = Math.sin(animationFrame * 0.1) * 3;
        drawPixelArt(collectible.x, collectible.y + floatOffset, sprite.pixels, sprite.scale);
    }

    function drawGround() {
        ctx.fillStyle = gameConfig.theme.groundColor;
        ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

        ctx.fillStyle = gameConfig.theme.groundGrassColor;
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.fillRect(i + (score % 20), groundY - 5, 10, 5);
        }
    }

    function drawBackground() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5);
        gradient.addColorStop(0, '#4a90e2');
        gradient.addColorStop(0.5, '#74b3e2');
        gradient.addColorStop(1, '#a8d5f2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);

        ctx.fillStyle = 'rgba(255, 220, 100, 0.8)';
        ctx.beginPath();
        ctx.arc(canvas.width - 150, 100, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        const cloudOffset = (score * 0.1) % 600;
        for (let i = 0; i < 3; i++) {
            const cloudX = i * 350 - cloudOffset;
            ctx.beginPath();
            ctx.arc(cloudX, 80 + i * 40, 35, 0, Math.PI * 2);
            ctx.arc(cloudX + 40, 80 + i * 40, 45, 0, Math.PI * 2);
            ctx.arc(cloudX + 80, 80 + i * 40, 40, 0, Math.PI * 2);
            ctx.fill();
        }

        const acropolisOffset = (score * 0.15) % 800;
        ctx.fillStyle = '#e8e8e8';
        const acropolisX = canvas.width / 2 - 200 - acropolisOffset;
        const acropolisY = groundY - 350;

        ctx.fillRect(acropolisX, acropolisY + 80, 400, 20);

        for (let i = 0; i < 8; i++) {
            const colX = acropolisX + 50 + i * 45;
            ctx.fillRect(colX, acropolisY + 100, 12, 3);
            ctx.fillRect(colX + 1, acropolisY + 30, 10, 70);
            ctx.fillRect(colX - 2, acropolisY + 25, 16, 5);
        }

        ctx.fillRect(acropolisX + 45, acropolisY + 20, 320, 5);
        ctx.beginPath();
        ctx.moveTo(acropolisX + 40, acropolisY + 20);
        ctx.lineTo(acropolisX + 205, acropolisY - 15);
        ctx.lineTo(acropolisX + 370, acropolisY + 20);
        ctx.closePath();
        ctx.fill();

        const buildingOffset = (score * 0.3) % 350;
        ctx.fillStyle = '#f5f5f5';
        for (let i = -1; i < canvas.width / 200 + 2; i++) {
            const x = i * 200 - buildingOffset;
            const height = 140 + (i % 3) * 20;
            ctx.fillRect(x, groundY - 200 - height, 180, height);
        }

        const flagOffset = (score * 2) % 300;
        for (let i = 0; i < canvas.width / 300 + 2; i++) {
            const flagX = i * 300 - flagOffset;
            const flagY = groundY - 50;
            ctx.fillStyle = '#666';
            ctx.fillRect(flagX, flagY - 60, 2, 60);
            ctx.fillStyle = '#4a90e2';
            ctx.fillRect(flagX + 2, flagY - 55, 20, 3);
            ctx.fillStyle = '#fff';
            ctx.fillRect(flagX + 2, flagY - 52, 20, 3);
            ctx.fillStyle = '#4a90e2';
            ctx.fillRect(flagX + 2, flagY - 49, 20, 3);
        }

        const treeOffset = (score * 1.5) % 200;
        for (let i = 0; i < canvas.width / 200 + 2; i++) {
            const treeX = i * 200 - treeOffset;
            const treeY = groundY - 45;
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(treeX - 3, treeY - 25, 6, 25);
            ctx.fillStyle = '#808000';
            ctx.beginPath();
            ctx.arc(treeX - 8, treeY - 25, 12, 0, Math.PI * 2);
            ctx.arc(treeX + 8, treeY - 25, 12, 0, Math.PI * 2);
            ctx.arc(treeX, treeY - 35, 14, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = '#d3d3d3';
        ctx.fillRect(0, groundY - 20, canvas.width, 20);
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
            if (leaderboard.length > 0) {
                ctx.fillStyle = '#ffd700';
                ctx.font = '22px "Courier New"';
                const topScore = leaderboard[0];
                const recordText = topScore.name ? `🌍 World Record: ${topScore.score} (${topScore.name})` : `🌍 World Record: ${topScore.score}`;
                ctx.fillText(recordText, canvas.width / 2, canvas.height / 2 + 90);
            }
            ctx.fillStyle = '#fff';
            ctx.font = '18px "Courier New"';
            ctx.fillText('Tap to start', canvas.width / 2, canvas.height / 2 + 130);
        } else if (gameState === 'PLAYING') {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px "Courier New"';
            ctx.textAlign = 'left';
            ctx.fillText(`Score: ${score}`, 20, 40);
            ctx.fillStyle = player.jumpCount === 0 ? '#4dabf7' : (player.jumpCount === 1 ? '#ffa500' : '#ff6b6b');
            ctx.fillText(`Jumps: ${'●'.repeat(player.maxJumps - player.jumpCount)}${'○'.repeat(player.jumpCount)}`, 20, 70);

            if (isLocalhost) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(20, 100, 250, 120);
                ctx.fillStyle = '#0f0';
                ctx.font = '14px "Courier New"';
                ctx.fillText('=== DEBUG ===', 30, 120);
                ctx.fillText(`Obstacles: ${obstacles.length}`, 30, 140);
                ctx.fillText(`Collectibles: ${collectibles.length}`, 30, 160);
                ctx.fillText(`Speed: ${gameSpeed.toFixed(2)}`, 30, 180);
                ctx.fillText(`Next spawn: ${obstacleTimer}`, 30, 200);
            }

            if (leaderboard.length > 0) {
                ctx.textAlign = 'right';
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(canvas.width - 280, 10, 270, 30 + leaderboard.length * 30);
                ctx.fillStyle = '#ffd700';
                ctx.font = 'bold 20px "Courier New"';
                ctx.fillText('🏆 TOP 3', canvas.width - 20, 35);
                leaderboard.forEach((entry, index) => {
                    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                    const color = index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32';
                    ctx.fillStyle = color;
                    ctx.font = '18px "Courier New"';
                    ctx.fillText(`${medal} ${entry.score} - ${entry.name}`, canvas.width - 20, 65 + index * 30);
                });
                ctx.textAlign = 'left';
            }
        } else if (gameState === 'GAME_OVER') {
            const topScore = leaderboard.length > 0 ? leaderboard[0].score : 0;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 48px "Courier New"';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 80);
            ctx.font = '32px "Courier New"';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 10);
            if (score >= topScore && score > 0) {
                ctx.fillStyle = '#ffd700';
                ctx.font = 'bold 28px "Courier New"';
                ctx.fillText('🌍 NEW WORLD RECORD! 🌍', canvas.width / 2, canvas.height / 2 + 30);
            } else if (topScore > 0) {
                ctx.fillStyle = '#fff';
                ctx.font = '24px "Courier New"';
                const topEntry = leaderboard[0];
                const recordText = topEntry.name ? `World Record: ${topEntry.score} (${topEntry.name})` : `World Record: ${topEntry.score}`;
                ctx.fillText(recordText, canvas.width / 2, canvas.height / 2 + 30);
            }
            ctx.fillStyle = '#fff';
            ctx.font = '20px "Courier New"';
            ctx.fillText('Credits in a few seconds...', canvas.width / 2, canvas.height / 2 + 80);
            ctx.font = '16px "Courier New"';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText('(Tap to continue)', canvas.width / 2, canvas.height / 2 + 110);
        } else if (gameState === 'CREDITS') {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.textAlign = 'center';
            let yPos = canvas.height - creditsOffset;
            const spacing = 300;
            gameConfig.credits.forEach((credit, index) => {
                const y = yPos + (index * spacing);
                if (y > -200 && y < canvas.height + 200) {
                    if (credit.sprite && gameConfig.obstacles.sprites[credit.sprite]) {
                        const sprite = gameConfig.obstacles.sprites[credit.sprite];
                        const spriteWidth = sprite.pixels[0].length * sprite.scale;
                        drawPixelArt(canvas.width / 2 - spriteWidth / 2, y - 80, sprite.pixels, sprite.scale);
                    }
                    ctx.fillStyle = '#ffd60a';
                    ctx.font = 'bold 36px "Courier New"';
                    ctx.fillText(credit.title, canvas.width / 2, y + 50);
                    ctx.fillStyle = '#fff';
                    ctx.font = '20px "Courier New"';
                    const lines = credit.description.split('\\n');
                    lines.forEach((line, lineIndex) => {
                        ctx.fillText(line, canvas.width / 2, y + 90 + (lineIndex * 30));
                    });
                }
            });
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '16px "Courier New"';
            ctx.fillText('Tap to skip', canvas.width / 2, canvas.height - 20);
        }
    }

    // Game logic
    function resetGame() {
        score = 0;
        gameSpeed = gameConfig.difficulty.baseSpeed * speedMultiplier;
        obstacles = [];
        obstacleTimer = 0;
        comboTimer = 0;
        tripleCombo = false;
        mixedHeightPattern = false;
        collectibles = [];
        collectibleTimer = 0;
        gameOverTimer = 0;
        creditsOffset = 0;
        recordSubmitted = false;
        player.y = player.groundY;
        player.velocityY = 0;
        player.jumping = false;
        player.jumpCount = 0;
        gameState = 'PLAYING';
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

    function jump() {
        if (gameState === 'PLAYING' && player.jumpCount < player.maxJumps) {
            player.velocityY = -gameConfig.player.jumpPower;
            player.jumping = true;
            player.jumpCount++;
        }
    }

    function createObstacle() {
        const types = Object.keys(gameConfig.obstacles.sprites);
        const type = types[Math.floor(Math.random() * types.length)];
        const sprite = gameConfig.obstacles.sprites[type];

        let yPos;
        if (sprite.flying) {
            yPos = groundY - 150 - Math.random() * 50;
        } else {
            yPos = groundY - sprite.height;
        }

        obstacles.push({
            x: canvas.width,
            y: yPos,
            width: sprite.width,
            height: sprite.height,
            type: type
        });
    }

    function updateObstacles() {
        obstacleTimer++;

        const currentInterval = gameConfig.obstacles.spawnInterval + Math.random() * gameConfig.obstacles.spawnVariation;

        if (obstacleTimer > currentInterval) {
            createObstacle();

            const pattern = Math.random();
            if (pattern < 0.25) {
                comboTimer = 25 + Math.random() * 15;
            } else if (pattern < 0.35 && score > 20) {
                comboTimer = 20;
                tripleCombo = true;
            } else if (pattern < 0.45 && score > 10) {
                comboTimer = 35;
                mixedHeightPattern = true;
            }

            obstacleTimer = 0;
        }

        if (comboTimer > 0) {
            comboTimer--;
            if (tripleCombo && comboTimer === 10) {
                createObstacle();
            }
            if (comboTimer === 0) {
                createObstacle();
                tripleCombo = false;
                mixedHeightPattern = false;
            }
        }

        obstacles.forEach((obstacle, index) => {
            obstacle.x -= gameSpeed;

            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                score++;

                if (score > 10 && score % gameConfig.difficulty.speedIncreaseInterval === 0) {
                    gameSpeed += gameConfig.difficulty.speedIncreaseFactor * speedMultiplier;
                }
            }
        });
    }

    function createCollectible() {
        const types = Object.keys(gameConfig.collectibles.sprites);
        if (types.length === 0) return;

        const type = types[Math.floor(Math.random() * types.length)];
        const sprite = gameConfig.collectibles.sprites[type];

        let yPos = groundY - 120 - Math.random() * 100;

        collectibles.push({
            x: canvas.width,
            y: yPos,
            width: sprite.width,
            height: sprite.height,
            type: type,
            points: sprite.points || 5
        });
    }

    function updateCollectibles() {
        collectibleTimer++;

        if (collectibleTimer > 150 + Math.random() * 100) {
            createCollectible();
            collectibleTimer = 0;
        }

        collectibles.forEach((collectible, index) => {
            collectible.x -= gameSpeed;

            if (collectible.x + collectible.width < 0) {
                collectibles.splice(index, 1);
            }
        });

        collectibles = collectibles.filter(collectible => {
            const marginX = 20;
            const marginY = 20;

            const collected = player.x + marginX < collectible.x + collectible.width &&
                             player.x + player.width - marginX > collectible.x &&
                             player.y + marginY < collectible.y + collectible.height &&
                             player.y + player.height - marginY > collectible.y;

            if (collected) {
                score += collectible.points;
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

    // Input handling
    function handleInput() {
        if (gameState === 'START') {
            gameState = 'PLAYING';
        } else if (gameState === 'PLAYING') {
            jump();
        } else if (gameState === 'CREDITS') {
            creditsOffset = (gameConfig.credits.length * 300) + canvas.height + 300;
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
        if (e.code === 'KeyR' && (gameState === 'GAME_OVER' || gameState === 'CREDITS')) {
            resetGame();
        }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        player.groundY = canvas.height - 170;
        player.y = player.groundY;
    });

    // Game loop
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBackground();
        drawGround();

        if (gameState === 'START') {
            drawPlayer();
            drawUI();
        } else if (gameState === 'PLAYING') {
            updatePlayer();
            updateObstacles();
            updateCollectibles();
            animationFrame++;

            collectibles.forEach(drawCollectible);
            obstacles.forEach(drawObstacle);
            drawPlayer();

            if (checkCollision()) {
                gameState = 'GAME_OVER';
                gameOverTimer = 0;
            }

            drawUI();
        } else if (gameState === 'GAME_OVER') {
            if (isTopScore(score) && !recordSubmitted) {
                recordSubmitted = true;
                showNameInput().then(playerName => {
                    submitScore(score, playerName).then(() => {
                        fetchLeaderboard();
                    });
                });
            }

            obstacles.forEach(drawObstacle);
            drawPlayer();
            drawUI();

            gameOverTimer++;
            if (gameOverTimer > 120) {
                gameState = 'CREDITS';
                creditsOffset = 0;
            }
        } else if (gameState === 'CREDITS') {
            drawUI();
            creditsOffset += 2;

            if (creditsOffset > (gameConfig.credits.length * 300) + canvas.height + 500) {
                gameState = 'GAME_OVER';
                creditsOffset = 0;
            }
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
    console.log('[GAME] Started! All 6 obstacles and 3 collectibles loaded.');

})();
