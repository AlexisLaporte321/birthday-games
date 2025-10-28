// Pixel art rendering system
export class PixelArtRenderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    // Generic pixel art drawing function
    drawPixelArt(x, y, pixels, scale = 2) {
        pixels.forEach((row, i) => {
            row.forEach((color, j) => {
                if (color) {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x + j * scale, y + i * scale, scale, scale);
                }
            });
        });
    }

    // Draw player with animation
    drawPlayer(player, config, animationFrame, showHitbox = false) {
        const runCycle = Math.floor(animationFrame / 10) % 2;
        const dogCycle = Math.floor(animationFrame / 8) % 2;

        // Combine upper body with appropriate lower body animation frame
        const playerSprite = [
            ...config.player.sprites.upper,
            ...config.player.sprites.lower[runCycle]
        ];

        this.drawPixelArt(player.x, player.y - 10, playerSprite, config.player.spriteScale || 3);

        // Draw companion if exists
        if (config.player.companion) {
            const companionSprite = config.player.companion.sprites[dogCycle];
            this.drawPixelArt(
                player.x + config.player.companion.offsetX,
                player.y + config.player.companion.offsetY,
                companionSprite,
                config.player.companion.scale || 2.5
            );
        }

        // Draw hitbox if enabled
        if (showHitbox) {
            const marginX = 10;
            const marginY = 15;

            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                player.x + marginX,
                player.y + marginY,
                player.width - marginX * 2,
                player.height - marginY * 2
            );

            // Draw full sprite boundary
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeRect(player.x, player.y, player.width, player.height);
            this.ctx.setLineDash([]);
        }
    }

    // Draw obstacle
    drawObstacle(obstacle, config, showHitbox = false) {
        const sprite = config.obstacles.sprites[obstacle.type];
        this.drawPixelArt(obstacle.x, obstacle.y, sprite.pixels, sprite.scale);

        // Draw hitbox if enabled
        if (showHitbox) {
            const marginX = 10;
            const marginY = 15;

            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                obstacle.x + marginX,
                obstacle.y + marginY,
                obstacle.width - marginX * 2,
                obstacle.height - marginY * 2
            );

            // Draw full sprite boundary
            this.ctx.strokeStyle = '#ff8888';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            this.ctx.setLineDash([]);
        }
    }

    // Draw collectible
    drawCollectible(collectible, config, animationFrame, showHitbox = false) {
        if (!config.collectibles || !config.collectibles.sprites) return;

        const sprite = config.collectibles.sprites[collectible.type];
        if (!sprite) return;

        // Add floating animation
        const floatOffset = Math.sin(animationFrame * 0.1) * 3;

        this.drawPixelArt(
            collectible.x,
            collectible.y + floatOffset,
            sprite.pixels,
            sprite.scale
        );

        // Draw hitbox if enabled
        if (showHitbox) {
            const marginX = 20;
            const marginY = 20;

            this.ctx.strokeStyle = '#0088ff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                collectible.x + marginX,
                collectible.y + floatOffset + marginY,
                collectible.width - marginX * 2,
                collectible.height - marginY * 2
            );

            // Draw full sprite boundary
            this.ctx.strokeStyle = '#88ccff';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeRect(collectible.x, collectible.y + floatOffset, collectible.width, collectible.height);
            this.ctx.setLineDash([]);
        }
    }

    // Draw ground
    drawGround(groundY, canvas, config, score) {
        // Ground
        this.ctx.fillStyle = config.theme.groundColor;
        this.ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

        // Grass/decoration on top of ground
        this.ctx.fillStyle = config.theme.groundGrassColor;
        for (let i = 0; i < canvas.width; i += 20) {
            this.ctx.fillRect(i + (score % 20), groundY - 5, 10, 5);
        }
    }

    // Draw credits sequence
    drawCredits(creditsOffset, credits, obstacleSprites, canvas, config) {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.ctx.textAlign = 'center';

        let yPos = canvas.height - creditsOffset;
        const spacing = 300;

        credits.forEach((credit, index) => {
            const y = yPos + (index * spacing);

            // Only draw if visible on screen
            if (y > -200 && y < canvas.height + 200) {
                // Draw the sprite
                if (credit.sprite === 'player') {
                    // Simplified player sprite for credits
                    const simplePlayer = config.credits?.playerSprite || [
                        [0, 0, '#ffdbac', '#ffdbac', '#ffdbac', 0, 0],
                        [0, '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', 0],
                        [0, '#333', '#fff', '#333', '#333', '#fff', 0],
                        [0, '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', '#ffdbac', 0],
                        [0, 0, '#ff6b6b', '#ff6b6b', '#ff6b6b', 0, 0],
                        [0, '#4dabf7', '#4dabf7', '#4dabf7', '#4dabf7', '#4dabf7', 0],
                        [0, '#4dabf7', '#4dabf7', 0, '#4dabf7', '#4dabf7', 0],
                        [0, '#333', '#333', 0, '#333', '#333', 0]
                    ];

                    const simpleCompanion = config.credits?.companionSprite || [
                        [0, '#8b4513', '#8b4513', 0, 0],
                        ['#8b4513', '#8b4513', '#8b4513', '#8b4513', 0],
                        ['#333', '#8b4513', '#8b4513', '#8b4513', '#8b4513'],
                        [0, '#8b4513', '#8b4513', '#8b4513', 0],
                        [0, '#654321', 0, '#654321', 0]
                    ];

                    this.drawPixelArt(canvas.width / 2 - 60, y - 100, simplePlayer, 8);
                    if (config.player.companion) {
                        this.drawPixelArt(canvas.width / 2 + 20, y - 50, simpleCompanion, 8);
                    }
                } else if (credit.sprite && obstacleSprites[credit.sprite]) {
                    const sprite = obstacleSprites[credit.sprite];
                    const spriteWidth = sprite.pixels[0].length * sprite.scale;
                    this.drawPixelArt(canvas.width / 2 - spriteWidth / 2, y - 80, sprite.pixels, sprite.scale);
                }

                // Title
                this.ctx.fillStyle = '#ffd60a';
                this.ctx.font = 'bold 36px "Courier New"';
                this.ctx.fillText(credit.title, canvas.width / 2, y + 50);

                // Description
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '20px "Courier New"';
                const lines = credit.description.split('\n');
                lines.forEach((line, lineIndex) => {
                    this.ctx.fillText(line, canvas.width / 2, y + 90 + (lineIndex * 30));
                });
            }
        });

        // Skip/replay indication
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.font = '16px "Courier New"';
        if (creditsOffset < (credits.length * spacing) + canvas.height) {
            this.ctx.fillText('Tap to skip', canvas.width / 2, canvas.height - 20);
        } else {
            this.ctx.fillText('Tap to replay', canvas.width / 2, canvas.height - 20);
        }
    }
}
