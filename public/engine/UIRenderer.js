// UI rendering for game screens
export class UIRenderer {
    constructor(ctx, config) {
        this.ctx = ctx;
        this.config = config;
    }

    drawStartScreen(canvas, leaderboard) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 48px "Courier New"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.config.text.title, canvas.width / 2, canvas.height / 2 - 80);

        this.ctx.font = '24px "Courier New"';
        this.ctx.fillText(this.config.text.instruction, canvas.width / 2, canvas.height / 2 - 10);

        this.ctx.font = '20px "Courier New"';
        this.ctx.fillText(this.config.text.subtitle, canvas.width / 2, canvas.height / 2 + 40);

        if (leaderboard.length > 0) {
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = '22px "Courier New"';
            const topScore = leaderboard[0];
            const recordText = topScore.name ?
                `🌍 World Record: ${topScore.score} (${topScore.name})` :
                `🌍 World Record: ${topScore.score}`;
            this.ctx.fillText(recordText, canvas.width / 2, canvas.height / 2 + 90);
        }

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '18px "Courier New"';
        this.ctx.fillText('Tap to start', canvas.width / 2, canvas.height / 2 + 130);
    }

    drawGameOver(canvas, score, leaderboard) {
        const topScore = leaderboard.length > 0 ? leaderboard[0].score : 0;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 48px "Courier New"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 80);

        this.ctx.font = '32px "Courier New"';
        this.ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 10);

        // Show new world record or current world record
        if (score >= topScore && score > 0) {
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = 'bold 28px "Courier New"';
            this.ctx.fillText('🌍 NEW WORLD RECORD! 🌍', canvas.width / 2, canvas.height / 2 + 30);
        } else if (topScore > 0) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '24px "Courier New"';
            const topEntry = leaderboard[0];
            const recordText = topEntry.name ?
                `World Record: ${topEntry.score} (${topEntry.name})` :
                `World Record: ${topEntry.score}`;
            this.ctx.fillText(recordText, canvas.width / 2, canvas.height / 2 + 30);
        }

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px "Courier New"';
        this.ctx.fillText('Credits in a few seconds...', canvas.width / 2, canvas.height / 2 + 80);

        this.ctx.font = '16px "Courier New"';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.fillText('(Tap to continue)', canvas.width / 2, canvas.height / 2 + 110);
    }

    drawScore(score, player, leaderboard, canvas, debugInfo = null) {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px "Courier New"';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${score}`, 20, 40);

        // Double jump indicator
        this.ctx.fillStyle = player.jumpCount === 0 ? '#4dabf7' : (player.jumpCount === 1 ? '#ffa500' : '#ff6b6b');
        this.ctx.fillText(`Jumps: ${'●'.repeat(player.maxJumps - player.jumpCount)}${'○'.repeat(player.jumpCount)}`, 20, 70);

        // Debug box (only in localhost)
        if (debugInfo && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(20, 100, 250, 120);

            this.ctx.fillStyle = '#0f0';
            this.ctx.font = '14px "Courier New"';
            this.ctx.fillText('=== DEBUG ===', 30, 120);
            this.ctx.fillText(`Obstacles: ${debugInfo.obstacles}`, 30, 140);
            this.ctx.fillText(`Collectibles: ${debugInfo.collectibles}`, 30, 160);
            this.ctx.fillText(`Speed: ${debugInfo.speed?.toFixed(2)}`, 30, 180);
            this.ctx.fillText(`Next spawn: ${debugInfo.nextSpawn}`, 30, 200);
        }

        // Leaderboard in top right corner
        if (leaderboard.length > 0) {
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(canvas.width - 280, 10, 270, 30 + leaderboard.length * 30);

            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = 'bold 20px "Courier New"';
            this.ctx.fillText('🏆 TOP 3', canvas.width - 20, 35);

            leaderboard.forEach((entry, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                const color = index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32';
                this.ctx.fillStyle = color;
                this.ctx.font = '18px "Courier New"';
                const text = `${medal} ${entry.score} - ${entry.name}`;
                this.ctx.fillText(text, canvas.width - 20, 65 + index * 30);
            });

            this.ctx.textAlign = 'left';
        }
    }
}
