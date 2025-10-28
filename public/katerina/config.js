// Configuration for Katerina's birthday game
export const gameConfig = {
    // PLAYER CHARACTER (Katerina)
    player: {
        width: 100,
        height: 120,
        jumpPower: 16,
        maxJumps: 3,
        spriteScale: 3,

        // Player sprites (Katerina - Venture Designer @ 321 - Ekinox/Eurobank project)
        sprites: {
            // Upper body (static)
            upper: [
                // Hair (châtain with caramel/honey highlights - LONG flowing hair)
                [0, 0, 0, '#8b6f47', '#a0826d', '#b8956a', '#b8956a', '#a0826d', '#8b6f47', 0, 0, 0],
                [0, 0, '#8b6f47', '#b8956a', '#c9a876', '#d4b896', '#d4b896', '#c9a876', '#b8956a', '#8b6f47', 0, 0],
                [0, '#8b6f47', '#a0826d', '#c9a876', '#d4b896', '#e8d4b0', '#e8d4b0', '#d4b896', '#c9a876', '#a0826d', '#8b6f47', 0],
                [0, '#b8956a', '#c9a876', '#d4b896', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#d4b896', '#c9a876', '#b8956a', 0],
                // Head with visible long hair on sides
                ['#8b6f47', '#c9a876', '#d4b896', '#ffdbac', '#333', '#fff', '#fff', '#333', '#ffdbac', '#d4b896', '#c9a876', '#8b6f47'],
                ['#a0826d', '#c9a876', '#ffdbac', '#ffdbac', '#ffdbac', '#ffc0cb', '#ffc0cb', '#ffdbac', '#ffdbac', '#ffdbac', '#c9a876', '#a0826d'],
                ['#b8956a', '#d4b896', '#ffdbac', '#ffdbac', '#ff9999', '#ff9999', '#ff9999', '#ff9999', '#ffdbac', '#ffdbac', '#d4b896', '#b8956a'],
                // Neck with long hair flowing down
                ['#c9a876', '#d4b896', '#e8d4b0', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#e8d4b0', '#d4b896', '#c9a876'],
                ['#b8956a', '#c9a876', '#d4b896', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#d4b896', '#c9a876', '#b8956a'],
                // Professional blazer with long hair on sides
                ['#a0826d', '#b8956a', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#b8956a', '#a0826d'],
                ['#8b6f47', '#a0826d', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#a0826d', '#8b6f47'],
                ['#8b6f47', '#a0826d', '#1d3557', '#1d3557', '#1d3557', '#fff', '#fff', '#1d3557', '#1d3557', '#1d3557', '#a0826d', '#8b6f47'],
                ['#8b6f47', '#b8956a', '#1d3557', '#1d3557', '#1d3557', '#fff', '#fff', '#1d3557', '#1d3557', '#1d3557', '#b8956a', '#8b6f47'],
                ['#8b6f47', '#b8956a', '#1d3557', '#1d3557', '#1d3557', '#fff', '#fff', '#1d3557', '#1d3557', '#1d3557', '#b8956a', '#8b6f47'],
                // Torso with long hair continuing down
                ['#8b6f47', '#a0826d', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#a0826d', '#8b6f47'],
                [0, '#8b6f47', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#8b6f47', 0],
                [0, '#8b6f47', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#1d3557', '#8b6f47', 0],
                // Pants upper (professional dark pants)
                [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
                [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0],
                [0, 0, 0, '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', '#2e3440', 0, 0, 0]
            ],

            // Lower body animation frames
            lower: [
                // Frame 0
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
                    // Professional heels
                    [0, 0, '#333', '#333', '#333', 0, 0, '#333', '#333', '#333', 0, 0],
                    [0, '#333', '#333', '#333', '#333', 0, 0, '#333', '#333', '#333', '#333', 0],
                    [0, '#333', '#333', '#333', 0, 0, 0, '#333', '#333', '#333', 0, 0]
                ],
                // Frame 1
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

        // Companion (Greek cat - Mediterranean colors)
        companion: {
            offsetX: 45,
            offsetY: 55,
            scale: 2.5,

            sprites: [
                // Cat frame 0 (white/ginger Greek cat)
                [
                    [0, 0, '#d4a574', 0, 0, 0, 0, 0, '#d4a574', 0, 0],
                    [0, '#d4a574', '#fff', '#d4a574', 0, 0, 0, '#d4a574', '#fff', '#d4a574', 0],
                    // Head
                    [0, 0, '#d4a574', '#fff', '#fff', '#d4a574', '#fff', '#fff', '#d4a574', 0, 0],
                    [0, '#d4a574', '#fff', '#333', '#fff', '#d4a574', '#fff', '#333', '#fff', '#d4a574', 0],
                    [0, '#d4a574', '#fff', '#fff', '#fff', '#ffc0cb', '#fff', '#fff', '#fff', '#d4a574', 0],
                    [0, 0, '#d4a574', '#fff', '#fff', '#fff', '#fff', '#fff', '#d4a574', 0, 0],
                    // Body
                    [0, 0, '#d4a574', '#fff', '#fff', '#fff', '#fff', '#fff', '#d4a574', '#d4a574', 0],
                    [0, '#d4a574', '#d4a574', '#fff', '#fff', '#fff', '#fff', '#d4a574', '#d4a574', '#d4a574', '#d4a574'],
                    [0, '#d4a574', '#d4a574', '#d4a574', '#fff', '#fff', '#fff', '#d4a574', '#d4a574', '#d4a574', 0],
                    [0, '#d4a574', '#d4a574', '#d4a574', '#fff', '#fff', '#fff', '#d4a574', '#d4a574', '#d4a574', 0],
                    // Legs
                    [0, '#fff', '#fff', 0, 0, '#fff', '#fff', 0, 0, '#d4a574', '#d4a574', 0],
                    [0, '#fff', '#fff', 0, 0, '#fff', '#fff', 0, 0, '#d4a574', '#d4a574', 0],
                    [0, '#333', '#333', 0, 0, '#333', '#333', 0, 0, '#333', '#333', 0]
                ],
                // Cat frame 1
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

    // OBSTACLES (Greek/Product Manager themed)
    obstacles: {
        spawnInterval: 80,
        spawnVariation: 50,

        sprites: {
            column: {
                // Greek Parthenon column
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
            },
            roadmap: {
                // Venture design canvas document flying
                pixels: [
                    ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
                    ['#fff', '#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2', '#fff'],
                    ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
                    ['#fff', '#e74c3c', '#e74c3c', '#333', '#333', '#333', '#333', '#fff'],
                    ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
                    ['#fff', '#f39c12', '#f39c12', '#333', '#333', '#333', '#333', '#fff'],
                    ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
                    ['#fff', '#2ecc71', '#2ecc71', '#333', '#333', '#333', '#333', '#fff']
                ],
                scale: 5,
                width: 40,
                height: 40,
                flying: true
            },
            frappe: {
                // Greek frappé coffee
                pixels: [
                    [0, 0, '#ccc', 0, '#ccc', 0, 0],
                    [0, 0, 0, '#ccc', 0, 0, 0],
                    [0, 0, 0, '#ff6b6b', 0, 0, 0],
                    [0, '#fff', '#fff', '#d4a574', '#fff', '#fff', 0],
                    [0, '#fff', '#d4a574', '#d4a574', '#d4a574', '#fff', 0],
                    [0, '#fff', '#d4a574', '#d4a574', '#d4a574', '#fff', 0],
                    [0, '#fff', '#d4a574', '#d4a574', '#d4a574', '#fff', 0],
                    [0, '#fff', '#d4a574', '#d4a574', '#d4a574', '#fff', 0],
                    [0, '#fff', '#fff', '#fff', '#fff', '#fff', 0],
                    [0, 0, '#fff', '#fff', '#fff', 0, 0]
                ],
                scale: 5,
                width: 35,
                height: 50
            },
            vespa: {
                // Greek Vespa scooter (blue/white colors)
                pixels: [
                    [0, 0, 0, '#4a90e2', '#4a90e2', '#4a90e2', 0, 0, 0, 0],
                    [0, 0, '#4a90e2', '#fff', '#fff', '#fff', '#4a90e2', 0, 0, 0],
                    [0, '#4a90e2', '#fff', '#fff', '#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2', 0, 0],
                    ['#4a90e2', '#fff', '#fff', '#4a90e2', '#4a90e2', '#333', '#333', '#4a90e2', '#4a90e2', 0],
                    ['#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2', '#333', '#333', '#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2'],
                    [0, '#333', '#333', '#333', '#333', '#4a90e2', '#4a90e2', '#333', '#333', '#333'],
                    [0, 0, '#333', '#666', '#333', 0, 0, '#333', '#666', '#333']
                ],
                scale: 5,
                width: 50,
                height: 35
            },
            olive: {
                // Olive tree in pot
                pixels: [
                    [0, 0, '#228b22', '#228b22', '#228b22', 0, 0],
                    [0, '#228b22', '#228b22', '#228b22', '#228b22', '#228b22', 0],
                    ['#228b22', '#228b22', '#8b4513', '#228b22', '#228b22', '#228b22', '#228b22'],
                    [0, '#228b22', '#8b4513', '#8b4513', '#228b22', '#228b22', 0],
                    [0, 0, '#8b4513', '#8b4513', '#228b22', 0, 0],
                    [0, 0, '#8b4513', '#8b4513', 0, 0, 0],
                    [0, '#a0522d', '#a0522d', '#a0522d', '#a0522d', '#a0522d', 0],
                    [0, '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', 0],
                    [0, '#8b4513', '#8b4513', '#8b4513', '#8b4513', '#8b4513', 0]
                ],
                scale: 5,
                width: 35,
                height: 45
            },
            meeting: {
                // Stakeholder meeting
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
            }
        }
    },

    // COLLECTIBLES (Greek/Venture Design themed bonus items)
    collectibles: {
        sprites: {
            eurocoin: {
                // Euro coin
                pixels: [
                    [0, '#ffd700', '#ffd700', '#ffd700', 0],
                    ['#ffd700', '#fff200', '#fff200', '#fff200', '#ffd700'],
                    ['#ffd700', '#fff200', '€', '#fff200', '#ffd700'],
                    ['#ffd700', '#fff200', '#fff200', '#fff200', '#ffd700'],
                    [0, '#ffd700', '#ffd700', '#ffd700', 0]
                ],
                scale: 6,
                width: 30,
                height: 30,
                points: 10
            },
            greekflag: {
                // Small Greek flag
                pixels: [
                    ['#4a90e2', '#fff', '#4a90e2'],
                    ['#fff', '#4a90e2', '#fff'],
                    ['#4a90e2', '#fff', '#4a90e2'],
                    ['#fff', '#fff', '#fff'],
                    ['#4a90e2', '#4a90e2', '#4a90e2']
                ],
                scale: 6,
                width: 18,
                height: 30,
                points: 5
            },
            lightbulb: {
                // Innovation lightbulb
                pixels: [
                    [0, '#fff200', '#fff200', '#fff200', 0],
                    ['#fff200', '#fff200', '#fff200', '#fff200', '#fff200'],
                    ['#fff200', '#fff200', '#fff200', '#fff200', '#fff200'],
                    ['#fff200', '#fff200', '#fff200', '#fff200', '#fff200'],
                    [0, '#fff200', '#fff200', '#fff200', 0],
                    [0, '#666', '#666', '#666', 0],
                    [0, '#666', '#666', '#666', 0]
                ],
                scale: 5,
                width: 25,
                height: 35,
                points: 15
            }
        }
    },

    // CREDITS
    credits: [
        {
            title: 'KATERINA & HER CAT',
            description: 'Our Venture Designer crafting\nEkinox innovations for Eurobank',
            sprite: 'player'
        },
        {
            title: 'THE PARTHENON COLUMN',
            description: 'Ancient wisdom inspiring\nmodern banking solutions',
            sprite: 'column'
        },
        {
            title: 'THE DESIGN CANVAS',
            description: 'Strategic visions that pivot faster\nthan Greek weather',
            sprite: 'roadmap'
        },
        {
            title: 'THE FRAPPÉ',
            description: 'Essential fuel for design sprints\nand stakeholder workshops',
            sprite: 'frappe'
        },
        {
            title: 'THE VESPA',
            description: 'Racing between 321 Studio\nand Eurobank meetings',
            sprite: 'vespa'
        },
        {
            title: 'THE OLIVE TREE',
            description: 'Symbol of patience needed\nfor banking innovation',
            sprite: 'olive'
        },
        {
            title: 'THE STAKEHOLDER MEETING',
            description: 'Where venture design meets\nbanking requirements',
            sprite: 'meeting'
        },
        {
            title: '',
            description: 'HAPPY BIRTHDAY KATERINA!\n\n🎂 🇬🇷 🎉',
            sprite: null
        }
    ],

    // THEME
    theme: {
        groundColor: '#c9a876',
        groundGrassColor: '#95d5b2',
        textColor: '#fff',
        accentColor: '#ffd700'
    },

    // DIFFICULTY
    difficulty: {
        baseSpeed: 6.5,
        gravity: 0.8,
        speedIncreaseFactor: 0.5,
        speedIncreaseInterval: 3
    },

    // TEXT
    text: {
        title: '🎉 HAPPY BIRTHDAY KATERINA! 🎂',
        instruction: 'Help Katerina design the future of Ekinox & Eurobank!',
        subtitle: 'Tap to jump (triple jump for innovation sprints!)'
    }
};
