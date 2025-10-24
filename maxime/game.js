// Configuration du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables du jeu
let gameState = 'START'; // START, PLAYING, GAME_OVER, CREDITS
let score = 0;
let gameSpeed = 6;
let gravity = 0.8;
let creditsOffset = 0;
let gameOverTimer = 0;

// Personnage (Maxime + son chien)
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

// Sol
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

// Maxime et son chien (pixel art)
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

// Sprites des obstacles thématiques
const obstacleSprites = {
    costume: {
        // Homme en costume avec cravate
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
        // Ordinateur portable ouvert
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
        // Table de réunion avec 3 personnes
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
        // Tasse de café fumante
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
        // Post-it avec texte
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

// Dessiner un obstacle
function drawObstacle(obstacle) {
    const sprite = obstacleSprites[obstacle.type];
    drawPixelArt(obstacle.x, obstacle.y, sprite.pixels, sprite.scale);
}

// Générique
const credits = [
    {
        title: 'MAXIME & SON CHIEN',
        description: 'Nos héros courageux qui affrontent\nles défis du quotidien startup',
        sprite: 'player'
    },
    {
        title: 'L\'HOMME EN COSTUME',
        description: 'Le collègue mystérieux qui parle\nseulement de synergies et KPIs',
        sprite: 'costume'
    },
    {
        title: 'L\'ORDINATEUR PORTABLE',
        description: 'Symbole des longues soirées de code\net des deadlines impossibles',
        sprite: 'laptop'
    },
    {
        title: 'LA RÉUNION',
        description: 'Trois personnes qui auraient pu\nenvoyer un email',
        sprite: 'meeting'
    },
    {
        title: 'LE CAFÉ',
        description: 'Le carburant essentiel pour\nsurvivre dans la jungle startup',
        sprite: 'coffee'
    },
    {
        title: 'LE POST-IT',
        description: 'Les TODO qui s\'accumulent\net volent partout',
        sprite: 'postit'
    },
    {
        title: '',
        description: 'JOYEUX ANNIVERSAIRE MAXIME!\n\n🎂 🎉 🎈',
        sprite: null
    }
];

// Sol et décor
function drawGround() {
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

    // Herbe
    ctx.fillStyle = '#95d5b2';
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i + (score % 20), groundY - 5, 10, 5);
    }
}

// Saut
function jump() {
    if (!player.jumping && gameState === 'PLAYING') {
        player.velocityY = -18;
        player.jumping = true;
    }
}

// Mise à jour du joueur
function updatePlayer() {
    player.velocityY += gravity;
    player.y += player.velocityY;

    if (player.y >= player.groundY) {
        player.y = player.groundY;
        player.velocityY = 0;
        player.jumping = false;
    }
}

// Création des obstacles
function createObstacle() {
    const types = ['costume', 'laptop', 'meeting', 'coffee', 'postit'];
    const type = types[Math.floor(Math.random() * types.length)];
    const sprite = obstacleSprites[type];

    let yPos;
    if (type === 'postit') {
        // Post-its volent dans les airs
        yPos = groundY - 150 - Math.random() * 50;
    } else if (type === 'laptop') {
        // Ordinateurs au sol
        yPos = groundY - sprite.pixels.length * sprite.scale;
    } else {
        // Autres obstacles debout
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

// Mise à jour des obstacles
function updateObstacles() {
    obstacleTimer++;

    // Intervalle variable pour plus de rythme
    const currentInterval = 80 + Math.random() * 70;

    if (obstacleTimer > currentInterval) {
        createObstacle();

        // Parfois créer un combo (2 obstacles rapprochés)
        if (Math.random() < 0.2) {
            comboTimer = 30; // Créer un obstacle dans 30 frames
        }

        obstacleTimer = 0;
    }

    // Gestion des combos
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

            // Augmentation progressive de la vitesse
            if (score % 10 === 0 && gameSpeed < 12) {
                gameSpeed += 0.5;
            }
        }
    });
}

// Détection de collision
function checkCollision() {
    return obstacles.some(obstacle => {
        // Marge de tolérance réduite pour de meilleures collisions
        const marginX = 10;
        const marginY = 15;

        return player.x + marginX < obstacle.x + obstacle.width &&
               player.x + player.width - marginX > obstacle.x &&
               player.y + marginY < obstacle.y + obstacle.height &&
               player.y + player.height - marginY > obstacle.y;
    });
}

// Écran de départ
function drawStartScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 JOYEUX ANNIVERSAIRE MAXIME! 🎂', canvas.width / 2, canvas.height / 2 - 50);

    ctx.font = '24px "Courier New"';
    ctx.fillText('Aide Maxime et son chien à éviter les obstacles!', canvas.width / 2, canvas.height / 2 + 20);

    ctx.font = '20px "Courier New"';
    ctx.fillText('Appuie sur ESPACE ou clique pour commencer', canvas.width / 2, canvas.height / 2 + 80);
}

// Écran de game over
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 50);

    ctx.font = '32px "Courier New"';
    ctx.fillText(`Score final: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

    ctx.font = '20px "Courier New"';
    ctx.fillText('Générique dans quelques secondes...', canvas.width / 2, canvas.height / 2 + 70);

    ctx.font = '16px "Courier New"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('(R pour rejouer maintenant)', canvas.width / 2, canvas.height / 2 + 100);
}

// Générique de fin
function drawCredits() {
    // Fond noir
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';

    let yPos = canvas.height - creditsOffset;
    const spacing = 300;

    credits.forEach((credit, index) => {
        const y = yPos + (index * spacing);

        // Ne dessiner que si visible à l'écran
        if (y > -200 && y < canvas.height + 200) {
            // Dessiner le sprite
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

            // Titre
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

    // Indication skip/rejouer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px "Courier New"';
    if (creditsOffset < (credits.length * spacing) + canvas.height) {
        ctx.fillText('ESPACE pour passer - R pour rejouer', canvas.width / 2, canvas.height - 20);
    } else {
        ctx.fillText('Appuie sur R pour rejouer', canvas.width / 2, canvas.height - 20);
    }

    // Animation
    creditsOffset += 2;

    // Fin du générique - retour au game over
    if (creditsOffset > (credits.length * spacing) + canvas.height + 500) {
        gameState = 'GAME_OVER';
        creditsOffset = 0;
    }
}

// Réinitialisation du jeu
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

// Boucle de jeu principale
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Arrière-plan
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

        // Dessiner les obstacles
        obstacles.forEach(obstacle => {
            drawObstacle(obstacle);
        });

        drawPlayer();

        // Vérifier les collisions
        if (checkCollision()) {
            gameState = 'GAME_OVER';
            gameOverTimer = 0;
        }

        // Afficher le score
        document.getElementById('scoreDisplay').textContent = score;
    } else if (gameState === 'GAME_OVER') {
        // Dessiner les obstacles en état figé
        obstacles.forEach(obstacle => {
            drawObstacle(obstacle);
        });

        drawPlayer();
        drawGameOver();

        // Lancer automatiquement le générique après 2 secondes
        gameOverTimer++;
        if (gameOverTimer > 120) { // 120 frames = ~2 secondes
            gameState = 'CREDITS';
            creditsOffset = 0;
        }
    } else if (gameState === 'CREDITS') {
        drawCredits();
    }

    requestAnimationFrame(gameLoop);
}

// Contrôles
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'START') {
            gameState = 'PLAYING';
        } else if (gameState === 'PLAYING') {
            jump();
        } else if (gameState === 'CREDITS') {
            // Skip le générique
            creditsOffset = (credits.length * 300) + canvas.height + 300;
        }
    }

    // Touche R pour rejouer directement
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

// Redimensionnement
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.groundY = canvas.height - 220;
    player.y = player.groundY;
});

// Démarrage du jeu
gameLoop();
