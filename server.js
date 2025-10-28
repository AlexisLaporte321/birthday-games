const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// In-memory storage for top 3 leaderboards (separate for local and prod)
let leaderboardLocal = [];
let leaderboardProd = [];

// Helper to determine if request is from localhost
function isLocalhost(req) {
    const host = req.get('host') || '';
    return host.includes('localhost') || host.includes('127.0.0.1');
}

// Servir les fichiers statiques depuis public/
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// API: Get leaderboard (auto-detects local vs prod)
app.get('/api/highscore', (req, res) => {
    const leaderboard = isLocalhost(req) ? leaderboardLocal : leaderboardProd;
    res.json({ leaderboard });
});

// API: Submit new score (auto-detects local vs prod)
app.post('/api/highscore', (req, res) => {
    const { score, name } = req.body;
    const isLocal = isLocalhost(req);
    let leaderboard = isLocal ? leaderboardLocal : leaderboardProd;

    if (typeof score === 'number' && score > 0) {
        // Add new score
        leaderboard.push({
            score,
            name: name || 'Anonymous'
        });

        // Sort by score descending and keep only top 3
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 3);

        // Update the correct leaderboard
        if (isLocal) {
            leaderboardLocal = leaderboard;
        } else {
            leaderboardProd = leaderboard;
        }

        // Check if new score made it to top 3
        const isTopScore = leaderboard.some(entry => entry.score === score && entry.name === (name || 'Anonymous'));

        res.json({ leaderboard, newRecord: isTopScore });
    } else {
        res.json({ leaderboard, newRecord: false });
    }
});

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour le jeu de Maxime
app.get('/maxime', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'maxime', 'index.html'));
});

// Route pour le jeu de Katerina
app.get('/katerina', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'katerina', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
