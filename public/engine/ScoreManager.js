// Score and leaderboard management
export class ScoreManager {
    constructor() {
        this.leaderboard = [];
    }

    async fetchLeaderboard() {
        try {
            const res = await fetch('/api/highscore');
            const data = await res.json();
            this.leaderboard = data.leaderboard || [];
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err);
        }
    }

    async submitScore(score, name) {
        try {
            const res = await fetch('/api/highscore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score, name })
            });
            const data = await res.json();
            this.leaderboard = data.leaderboard || [];
            return true;
        } catch (err) {
            console.error('Failed to submit score:', err);
            return false;
        }
    }

    isTopScore(score) {
        if (this.leaderboard.length === 0) return score > 0;
        return score > 0 && (this.leaderboard.length < 3 || score > this.leaderboard[this.leaderboard.length - 1].score);
    }

    getTopScore() {
        return this.leaderboard.length > 0 ? this.leaderboard[0].score : 0;
    }

    // Show custom name input modal
    showNameInput() {
        return new Promise((resolve) => {
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
}
